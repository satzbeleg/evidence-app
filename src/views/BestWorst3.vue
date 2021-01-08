<template>
  <section class="section">
    <div class="container is-centered">      
      <template v-if="data.current.length > 0">
        <BestWorstChoices 
          v-bind:items="data.current"
          v-on:ranking-done="nextExampleSet"
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
import { defineComponent, reactive, watchEffect, watch, unref } from 'vue'; // computed 
import { useI18n } from 'vue-i18n';
import { useApi } from '@/functions/axios-evidence.js';
import Cookies from 'js-cookie';
import { useSettings } from '@/functions/settings.js';


export default defineComponent({
  name: "BestWorst3",

  components: {
    BestWorstChoices
  },

  setup(){
    // multi-lingual settings
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('bestworst.title');
    });

    // Load bestworst3 UI settings
    const { reorderpoint, orderquantity, loadSettings } = useSettings();
    

    // reactive data of this component
    const data = reactive({
      // Array with unlabelled example sets. It's a FIFO queue
      queue: [],

      // The current BWS-exampleset displayed inside the app
      current: [],
      current_setid: undefined,

      // Use to trigger component re-rendering with :key
      counter: 1,

      // Post this to the REST API (see saveEvaluations)
      evaluated: [],
    });

    // Replenish data.queue from database (load new example sets into queue)
    //const replenishQueue = (orderquantity = 10) => {
    const replenishQueue = () => {
      return new Promise((resolve, reject) => {
        const { api } = useApi(Cookies.get('auth_token'));
        api.get(`v1/bestworst/random/4/${unref(orderquantity)}`)
        .then(response => {
          // copy all example sets
          response.data.forEach(exset => data.queue.push(exset));
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {
          console.log(`Queue replenished to ${data.queue.length} examplesets`);
        });
      });
    }

    // Pull new current example set from queue
    async function pullFromQueue(){
      // Trigger initial replenishment if the data.queue is empty
      if (data.queue.length == 0){
        await loadSettings();  // wait till settings are loaded
        await replenishQueue();  // wait till finished
      }
      // Read the 1st element, and delete it from queue (FIFO principle)
      const tmp = data.queue.shift()
      if (typeof tmp !== 'undefined' ){
        data.current = tmp.examples;
        data.current_setid = tmp.set_id;
      }else{
        data.current = [];
        data.current_setid = undefined;
      }
    }

    // Store evaluation results, pull next example set from queue, trigger re-rendering
    async function nextExampleSet(history){
      // Map states with SentenceIDs (Don't send raw examples `data.current` back to API)
      var state_sentid = {}
      data.current.forEach((ex, i) => state_sentid[i] = ex.id)
      // Store latest evaluation
      data.evaluated.push({
        'set_id': data.current_setid,  // Only required for App/API-Sync
        'evaluations': JSON.parse(JSON.stringify(history)),  // to be stored in DB
        'state_sentid': state_sentid  // to be stored in DB
      });
      // Load the next example set
      pullFromQueue();
      // enforce rerendering via :key
      data.counter++;
    }

    // trigger AJAX request to replenish the queue
    watch(
      () => data.queue.length,
      (stocklevel) => {
        //const reorderpoint = 3;
        if (stocklevel < reorderpoint.value){
          console.log(`Queue is running low: ${stocklevel} examplesets`);
          replenishQueue();
        }
      }
    );

    // save evaluated sets into the databse
    const saveEvaluations = () => {
      return new Promise((resolve, reject) => {
        const { api } = useApi(Cookies.get('auth_token'));
        api.post(`v1/bestworst/evaluations`, data.evaluated)
        .then(response => {
          // delete evaluated sets if API confirms its storage
          response.data['stored-setids'].forEach(setid => {
            const idx = data.evaluated.findIndex(elem => elem['set_id'] == setid);
            data.evaluated.splice(idx, 1);
          });
          // console.log(`Stored example sets: ${response.data['stored-setids'].length}`);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {});
      });
    }

    // trigger AJAX to post evaluated BWS-exampleset
    watch(
      () => data.evaluated.length,
      (num_evaluated) => {
        if (num_evaluated > 0){
          console.log(`Number of evaluated BWS example sets: ${num_evaluated}`);
          saveEvaluations();
        }
      }
    )

    // load initial current BWS-exampleset
    pullFromQueue();

    return { data, pullFromQueue, nextExampleSet, reorderpoint, orderquantity }
  },

});
</script>

