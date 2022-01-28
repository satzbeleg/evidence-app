<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_lemmata_search="true"
             v-bind:lemma_keywords="queueData.current_lemmata"
             v-on:search-lemmata-navbar="onSearchLemmata"
             :key="queueData.counter" />

  <section class="section">    
    <div class="container is-centered" style="max-width: 720px;">

      <template v-if="queueData.current.length > 0">
        <!-- BWS UI -->
        <BestWorstChoices 
          v-bind:items="queueData.current"
          v-on:ranking-done="nextExampleSet"
          :key="queueData.counter"
        />
      </template>

      <template v-else>
        <PageLoader 
          v-bind:status="queueData.current.length == 0"
          v-bind:messages="['Queue is empty!', message_suggestion]" />
      </template>

    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import PageLoader from '@/components/layout/PageLoader.vue';
import BestWorstChoices from '@/components/bestworst/Choices.vue';
import { defineComponent, watchEffect, watch } from 'vue'; // unref, watch, computed
import { useI18n } from 'vue-i18n';
//import { useApi, useAuth } from '@/functions/axios-evidence.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
//import { traverseObject } from '@/functions/traverse-objects.js';
// import { ranking } from 'bwsample';
import { useInteractivity } from '@/components/bestworst/interactivity.js';
import { useQueue } from '@/components/bestworst/queue.js';
import { v4 as uuid4 } from 'uuid';


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


    // Load General UI settings
    const { loadGeneralSettings, debug_verbose } = useGeneralSettings();
    loadGeneralSettings();

    // Load BWS Settings
    const { queue_reorderpoint, retrain_patience, loadBwsSettings } = useBwsSettings();
    loadBwsSettings();


    // Load reactive variables for BWS Queue
    const { 
      uispec, 
      searchlemmata, 
      queueData, 
      isReplenishing, 
      message_suggestion,
      isSaving, 
      saveEvaluations,
      pullFromQueue, 
      nextExampleSet, 
      resetQueue
    } = useQueue();

    // configure UI meta info
    uispec["name"] = "bestworst4";

    // Load Interactivity Settings
    const { 
      pool, 
      // pairs, // only needed within interactivity.js:updatePairMatrix
      resetPool,
      dropExamplesFromPool,
      addExamplesToPool,
      updatePairMatrix,
      sampleBwsSets, 
      computeTrainingScores,
      retrainModel,
      predictScores
    } = useInteractivity();


    /**
     * [A1] Specify Replenishment from local `pool`
     * 
     * Global variables from queue.js
     * ------------------------------
     * @param {String} searchlemmata
     * @param {JSON}   data
     * @param {Boolan} isReplenishing
     * @param {String} message_suggestion
     * Function: pullFromQueue
     * 
     * Global variables from interactivity.js
     * --------------------------------------
     * 
     */
    const replenishQueue = async() => {
      // (Step 1) Drop examples
      await dropExamplesFromPool();

      // (Step 2) Add examples to pool
      await addExamplesToPool(searchlemmata.value);

      return new Promise((resolve, reject) => {
        try{
          isReplenishing.value = true;
          // (Step 3) Sample BWS sets from pool
          var sampled_bwssets = sampleBwsSets();
          // => In der App anzeigen =>
          sampled_bwssets.forEach(exset => {
            var examples = []
            exset.forEach(key => {
              examples.push({
                "id": key,
                "text": pool[key].text,
                "spans": pool[key].span
              });
            });
            queueData.queue.push({
              set_id: uuid4(),
              lemmata: searchlemmata.value.split(',').map(s => s.trim()),
              examples: examples
            })
          });
          isReplenishing.value = false;
          // Force moving a BWS set to UI
          if (queueData.current.length === 0){
            pullFromQueue(); // load data
            console.log("New current BWS set loaded")   // queueData.current
          }
          resolve();
        }catch(msg){
          message_suggestion.value = "Unknown Error!";
          reject(msg)
        }
      });
    }
    
    /**
     * [A2] Load initial current BWS-exampleset
     * DEACTIVATED! Is triggered via low running queue [A3] 
     *         or search request via `onSearchLemmata` [A4]
     */
    //replenishQueue();


    /** 
     * [A3] Trigger AJAX request to replenish the queue
     */
    watch(
      () => queueData.queue.length,
      (stocklevel) => {
        if (stocklevel < queue_reorderpoint.value){
          if(debug_verbose.value){console.log(`[A3] Queue is running low: ${stocklevel} examplesets`);}
          replenishQueue();
          if(debug_verbose.value){console.log(`[A3] New pool size: ${Object.keys(pool).length}`);}
        }
      }
    );


    /**
     * [A4] Store the new Lemma, Reset the Queue data, Load new data
     */
    const onSearchLemmata = async(keywords) => {
      // delete pool and pairs matrix
      resetPool();
      // delete current example set in UI, and the whole queue.
      resetQueue();
      // reset `searchlemmata`
      searchlemmata.value = keywords
      // force to load next example in UI
      await replenishQueue();
      //await addExamplesToPool(queueData.current_lemmata, true);  // is called in replenishQueue
      //var sampled_bwssets = sampleBwsSets();
    }


    /** 
     * [B1] Trigger AJAX to post evaluated BWS-exampleset to database
     * - `saveEvaluations` will purge `queueData.evaluated`
     */
    watch(
      () => queueData.evaluated.length,
      (num_evaluated) => {
        if (num_evaluated > 0 && !isSaving.value){
          // console.log(`Number of evaluated BWS example sets: ${num_evaluated}`);
          updatePairMatrix(queueData);  // interactivity.js: Step (4)
          saveEvaluations();  // queue.js: Purge `queueData.evaluated`
        }
    });

    /**
     * [B2] Training phase 
     */
    watch(
      () => queueData.counter,
      (counter) => {
        if(debug_verbose.value){console.log(`Counter: ${counter}`)}
        if ((counter % retrain_patience.value) === 0){
          computeTrainingScores();  // (Step 5)
          retrainModel();  // (Step 6)
          predictScores();  // (Step 7)
        }
    });
    

    return { 
      queueData, 
      nextExampleSet,
      onSearchLemmata,
      message_suggestion
    }
  },

});
</script>

