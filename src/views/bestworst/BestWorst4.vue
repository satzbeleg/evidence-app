<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_lemmata_search="true"
             v-bind:lemma_keywords="data.current_lemmata"
             v-on:search-lemmata-navbar="onSearchLemmata"
             :key="data.counter" />

  <section class="section">    
    <div class="container is-centered" style="max-width: 720px;">

      <template v-if="data.current.length > 0">
        <!-- BWS UI -->
        <BestWorstChoices 
          v-bind:items="data.current"
          v-on:ranking-done="nextExampleSet"
          :key="data.counter"
        />
        <!-- progress bar -->
        <progress class="progress is-info mt-5" 
                  v-bind:value="data.queue.length" 
                  v-bind:max="maxprogress">
          {{ data.queue.length }}
        </progress>
      </template>
      <template v-else>
        <PageLoader 
          v-bind:status="data.current.length == 0"
          v-bind:messages="['Queue is empty!', message_suggestion]" />
      </template>

    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import PageLoader from '@/components/layout/PageLoader.vue';
import BestWorstChoices from '@/components/bestworst/Choices.vue';
import { defineComponent, reactive, watchEffect, watch, unref, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApi, useAuth } from '@/functions/axios-evidence.js';
import { useSettings } from '@/functions/settings.js';
import { traverseObject } from '@/functions/traverse-objects.js';


export default defineComponent({
  name: "BestWorst4",

  components: {
    TheNavbar,
    PageLoader,
    BestWorstChoices
  },

  setup(){
    // multi-lingual settings
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('bestworst.title');
    });


    // Load bestworst3 UI settings
    const { 
      loadSettings, reorderpoint, orderquantity,
      sampling_numtop, sampling_offset 
    } = useSettings();

    // Search string for lemmata/keywords
    const searchlemmata = ref("");

    // reactive data of this component
    const data = reactive({
      // Array with unlabelled example sets. It's a FIFO queue
      queue: [],

      // The current BWS-exampleset displayed inside the app
      current: [],
      current_setid: undefined,
      current_lemmata: undefined, //'Hello world,cool',

      // Use to trigger component re-rendering with :key
      counter: 1,

      // Post this to the REST API (see saveEvaluations)
      evaluated: [],
    });

    const isReplenishing = ref(false);
    const isSaving = ref(false);

    const message_suggestion = ref("Not connected! Please login.");


    // Replenish data.queue from database (load new example sets into queue)
    const replenishQueue = () => {
      return new Promise((resolve, reject) => {
        // Replensihing started
        isReplenishing.value = true;
        // preprocess lemmata/keyword search for POST request
        var params = {}
        if (typeof searchlemmata.value == "string"){
          if (searchlemmata.value.length > 0){
            params = {"lemmata": searchlemmata.value.split(',').map(s => s.trim())}
          }
        }
        // load other functions and objects
        const { getToken } = useAuth();
        const { api } = useApi(getToken());
        // start API request
        message_suggestion.value = "Loading new example sets ...";
        api.post(`v1/bestworst/samples/4/${unref(orderquantity)}/${unref(sampling_numtop)}/${unref(sampling_offset)}`, params)
        .then(response => {
          // Is there any error message returned?
          if ('status' in response.data){
            if ('msg' in response.data){
              message_suggestion.value = response.data['msg'];
            }
          }else if (typeof response.data == "object"){
            // copy all example sets
            response.data.forEach(exset => data.queue.push(exset));
          }else{
            message_suggestion.value = "API returned unexpected data.";
          }
          resolve(response);
        })
        .catch(error => {
          // message to user
          message_suggestion.value = "Unknown Error!";
          reject(error);
        })
        .finally(() => {
          isReplenishing.value = false;
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
        //console.log(tmp)
        data.current = tmp.examples;
        data.current_setid = tmp.set_id;
        data.current_lemmata = tmp.lemmata.join(", ");
      }else{
        data.current = [];
        data.current_setid = undefined;
        data.current_lemmata = undefined;
      }
    }

    // Store evaluation results, pull next example set from queue, trigger re-rendering
    async function nextExampleSet(history){
      // abort if the setId still exists in data.evaluated, i.e. the current setId
      // was not saved yet but the user keeps pushing the submit buttons (i.e. calling
      // the `nextExampleSet` function)
      data.evaluated.forEach(elem => {
        if (elem['set-id'] === data.current_setid){
          console.log(`The set-id='${elem['set-id']}' cannot be stored twice`);
          return;
        }
      });
      //console.log(data.evaluated)
      // Map states with SentenceIDs (Don't send raw examples `data.current` back to API)
      var state_sentid_map = {}
      data.current.forEach((ex, i) => state_sentid_map[i] = ex.id)
      // Store latest evaluation
      data.evaluated.push({
        'set-id': data.current_setid,  // Only required for App/API-Sync
        'ui-name': 'bestworst3',
        'lemmata': data.current_lemmata.split(',').map(s => s.trim()),
        'event-history': JSON.parse(JSON.stringify(history)),  // to be stored in DB
        'state-sentid-map': state_sentid_map,  // to be stored in DB
        'tracking-data': {
          'window': traverseObject(window, 0),
          'screen': traverseObject(window.screen, 1),
          'navigator': traverseObject(window.navigator, 1)
        }
      });
      // Load the next example set
      if (!isReplenishing.value){
        await pullFromQueue();
      }
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
        isSaving.value = true;
        const { getToken } = useAuth();
        const { api } = useApi(getToken());
        api.post(`v1/bestworst/evaluations`, data.evaluated)
        .then(response => {
          // delete evaluated sets if API confirms its storage
          response.data['stored-setids'].forEach(setid => {
            var idx = -1;
            while(( idx = data.evaluated.findIndex(elem => elem['set-id'] == setid) ) !== -1){
              data.evaluated.splice(idx, 1);
            }
          });
          console.log(`Stored example sets: ${response.data['stored-setids'].length}`);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {
          isSaving.value = false;
        });
      });
    }

    // trigger AJAX to post evaluated BWS-exampleset
    watch(
      () => data.evaluated.length,
      (num_evaluated) => {
        if (num_evaluated > 0){
          console.log(`Number of evaluated BWS example sets: ${num_evaluated}`);
          if(!isSaving.value){
            saveEvaluations();
          }
        }
      }
    );


    // get search field string to parent component
    const onSearchLemmata = async(keywords) => {
      // reset `searchlemmata`
      searchlemmata.value = keywords
      //console.log('Bestworst:', searchlemmata.value)
      
      // delete current example set in UI
      data.current = [];
      data.current_setid = undefined;
      data.current_lemmata = undefined;
      // this will trigger the watcher to call `replenishQueue` (POST requests)
      data.queue = [];  
      // force to load next example in UI
      await pullFromQueue();
    }


    // load initial current BWS-exampleset
    pullFromQueue();

    // compute max for progressba
    const maxprogress = computed(() => parseInt(reorderpoint.value) + parseInt(orderquantity.value));

    return { 
      data, pullFromQueue, nextExampleSet,
      maxprogress,
      onSearchLemmata,
      message_suggestion
    }
  },

});
</script>

