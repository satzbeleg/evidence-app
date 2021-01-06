<template>
  <section class="section">
    <div class="container is-centered">
      <template v-if="data.current.length > 0">
        <BestWorstChoices 
          v-bind:items="data.current"
          v-on:ranking-done="nextExample"
          :key="data.counter"
        />
      </template>
      <template v-else>
        Queue is empty. Please reconnect to API to request more ranking examples.
      </template>
    </div>
  </section>
</template>


<script>
import BestWorstChoices from '@/components/bestworst3/Choices.vue';
import { defineComponent, reactive, watchEffect, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApi } from '@/functions/axios-evidence.js';
import Cookies from 'js-cookie';


export default defineComponent({
  name: "BestWorst3",

  components: {
    BestWorstChoices
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('bestworst.title');
    });

    const data = reactive({
      // Array with unlabelled example sets. It's a FIFO queue
      queue: [],

      // The current BWS-exampleset displayed inside the app
      current: [],
      current_setid: undefined,

      // Use to trigger component re-rendering with :key
      counter: 1,

      // Move this to Vuex lateron
      evaluated: [],
    });

    async function nextChoice(){
      // Trigger initial replenishment if the data.queue is empty
      if (data.queue.length == 0){
        await replenishQueue();  // wait till finished
      }
      // read 1st element, and delete it from queue (FIFO principle)
      const tmp = data.queue.shift()
      if (typeof tmp !== 'undefined' ){
        data.current = tmp.examples;
        data.current_setid = tmp.set_id;
      }else{
        data.current = [];
        data.current_setid = undefined;
      }
    }

    async function nextExample(history){
      // TODO: We need to store more data
      data.evaluated.push({
        'set_id': data.current_setid,
        'examples': JSON.parse(JSON.stringify(data.current)),
        'evaluations': JSON.parse(JSON.stringify(history))
      });

      nextChoice();
      data.counter++; // enforce rerendering via :key
      // save results in bulk
      if(data.counter > 3){ // timeout
        console.log(data.counter, data.evaluated)
        data.counter = 1
      }
      // 
    }

    // Fetch new data into queue
    const replenishQueue = (orderquantity = 10) => {
      //console.log("Start to replenish data.queue from database");
      return new Promise((resolve, reject) => {
        const { api } = useApi(Cookies.get('auth_token'));
        api.get(`v1/bestworst/random/4/${orderquantity}`)
        .then(resp => {
          //console.log("RESPONSE: ", resp);
          //data.queue.push({"set_id": "some-rnd-id-generated-5", "examples": resp.data});
          resp.data.forEach(exset => data.queue.push(exset));
          resolve(resp);
        })
        .catch(err => {
          //console.log("ERROR: ", err);
          reject(err);
        })
        .finally(() => {
          //console.log("DONE: Yeah");
          console.log("Queue replenished up to ", data.queue.length, " examplesets");
        });
      });
    }

    // trigger AJAX request to replenish the queue
    watch(
      () => data.queue.length,
      (stocklevel) => {
        const reorderpoint = 3;
        if (stocklevel < reorderpoint){
          console.log(`Queue is running low: ${stocklevel} examplesets`);
          replenishQueue();
        }
      }
    );

    // save evaluation
    const saveEvaluations = () => {
      var num_evals = data.evaluated.length;
      var num_stored = 0;
      console.log(`Try to save ${num_evals} example sets from data.evaluated in the DB.`);

      return new Promise((resolve, reject) => {
        const { api } = useApi(Cookies.get('auth_token'));
        console.log(data.evaluated)
        api.post(`v1/bestworst/evaluations`, data.evaluated)
        .then(resp => {
          //console.log("RESPONSE: ", resp);
          //data.queue.push({"set_id": "some-rnd-id-generated-5", "examples": resp.data});
          console.log("response: ", resp.data['stored-setids']);
          resp.data['stored-setids'].forEach(setid => {
            const idx = data.evaluated.findIndex(elem => elem['set_id'] == setid);
            data.evaluated.splice(idx, 1);
          });
          num_stored = num_evals - data.evaluated.length
          resolve(resp);
        })
        .catch(err => {
          //console.log("ERROR: ", err);
          reject(err);
        })
        .finally(() => {
          //console.log("DONE: Yeah");
          console.log(`Stored example sets: ${num_stored}`);
        });
      });
    }

    // trigger AJAX to post evaluated BWS-exampleset
    watch(
      () => data.evaluated.length,
      (num_evaluated) => {
        if (num_evaluated > 0){
          console.log(`Number of evaluated BWS-examplesets ready to save: ${num_evaluated}`);
          saveEvaluations();
        }
      }
    )

    // load initial current BWS-exampleset
    nextChoice();

    return { data, nextChoice, nextExample }
  },

});
</script>

