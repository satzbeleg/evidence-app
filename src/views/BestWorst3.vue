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

      // Use to trigger component re-rendering with :key
      counter: 1,

      // Move this to Vuex lateron
      ranked: [],
    });

    async function nextChoice(){
      // Trigger initial replenishment if the data.queue is empty
      if (data.queue.length == 0){
        await replenishQueue();  // wait till finished
      }
      // read 1st element, and delete it from queue (FIFO principle)
      const tmp = data.queue.shift()
      if (typeof tmp !== 'undefined' ){
        data.current = tmp.examples
      }else{
        data.current = []
      }
    }

    async function nextExample(history){
      data.ranked.push(JSON.parse(JSON.stringify(history)));
      nextChoice();
      data.counter++; // enforce rerendering via :key
      // save results in bulk
      if(data.counter > 3){ // timeout
        console.log(data.counter, data.ranked)
        data.counter = 1
      }
      // 
    }

    // Fetch new data into queue
    const replenishQueue = () => {
      return new Promise((resolve, reject) => {
        const { api } = useApi(Cookies.get('auth_token'));
        api.get('v1/bestworst/random/4/5')
        .then(resp => {
          console.log("RESPONSE: ", resp);
          //data.queue.push({"set_id": "some-rnd-id-generated-5", "examples": resp.data});
          resp.data.forEach(exset => data.queue.push(exset));
          resolve(resp);
        })
        .catch(err => {
          console.log("ERROR: ", err);
          reject(err);
        })
        .finally(() => {
          console.log("DONE: Yeah");
        });
      });
    }

    // trigger AJAX request to replenish the queue
    watch(
      () => data.queue.length,
      (stocklevel) => {
        if (stocklevel <= 3){
          console.log("Queue is running low: ", stocklevel, " examplesets")
          console.log("Start to replenish data.queue from database")
          //data.queue = data.queue.concat(tmpdata.downloaded)
          //tmpdata.downloaded.forEach(ex => data.queue.push(ex))
          replenishQueue();
        }
      }
    )

    // load initial current BWS-exampleset
    nextChoice();

    return { data, nextChoice, nextExample }
  },

});
</script>

