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
import { defineComponent, watchEffect, watch } from 'vue'; // unref, watch, computed
import { useI18n } from 'vue-i18n';
//import { useApi, useAuth } from '@/functions/axios-evidence.js';
// import { useGeneralSettings } from '@/components/settings/general-settings.js';
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
//import { traverseObject } from '@/functions/traverse-objects.js';
//import { counting } from 'bwsample';
//import { ranking } from 'bwsample';
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
    // const { loadGeneralSettings } = useGeneralSettings();
    // loadGeneralSettings();

    // Load BWS Settings
    const { queue_reorderpoint, loadBwsSettings } = useBwsSettings();
    loadBwsSettings();


    // Load reactive variables for BWS Queue
    const { 
      uispec, 
      searchlemmata, 
      data, 
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
      pairs, 
      resetPool,
      dropExamplesFromPool,
      addExamplesToPool,
      sampleBwsSets, 
      // computeTrainingScores, smoothing_method, ema_alpha
    } = useInteractivity();

    /**
     * (1) Specify Replenishment from local `pool`
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
      // (2) Add examples to pool
      await addExamplesToPool(searchlemmata.value);
      // console.log("start repl:", pool)

      return new Promise((resolve, reject) => {
        try{
          isReplenishing.value = true;
          // (3) Sample 1,2,3... BWS sets from pool
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
            data.queue.push({
              set_id: uuid4(),
              lemmata: searchlemmata.value.split(',').map(s => s.trim()),
              examples: examples
            })
          });
          isReplenishing.value = false;
          // Force moving a BWS set to UI
          if (data.current.length === 0){
            pullFromQueue(); // load data
            console.log("New current BWS set loaded")
          }
          resolve();
        }catch(msg){
          message_suggestion.value = "Unknown Error!";
          reject(msg)
        }
      });
    }

    /** 
     * (1b) Trigger AJAX request to replenish the queue
     */
    watch(
      () => data.queue.length,
      (stocklevel) => {
        if (stocklevel < queue_reorderpoint.value){
          console.log(`Queue is running low: ${stocklevel} examplesets`);
          replenishQueue();
        }
      }
    );


    /**
     * (2) Trigger AJAX to post evaluated BWS-exampleset
     */
    watch(
      () => data.evaluated.length,
      (num_evaluated) => {
        if (num_evaluated > 0 && !isSaving.value){
          console.log(`Number of evaluated BWS example sets: ${num_evaluated}`);
          saveEvaluations();
        }
    });

    /**
     * (3) Store the new Lemma, Reset the Queue data, Load new data
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
      //await addExamplesToPool(data.current_lemmata, true);
      //var sampled_bwssets = sampleBwsSets();
    }


    /**
     * (3b) Load initial current BWS-exampleset
     */
    replenishQueue();


    // ---------------- TINKERING ------------------
    // load initial current BWS-exampleset
    //addExamplesToPool();

    // const stateids = ['abc', 'def', 'ghi', 'jkl'];
    // const combostates = [0, 0, 2, 1];
    // var [cnt, bw, bn, nw] = counting.direct_extract(stateids, combostates);
    // console.log(cnt, bw, bn, nw)
    // var [positions, sortedids, metrics, info] = ranking.maximize_hoaglinapprox(cnt);
    // console.log(positions, sortedids, metrics, info)



    console.log("Pairs:", pairs)
    console.log("Pool:", pool)
    // console.log(JSON.parse(JSON.stringify(pool)))


    // (1) Drop examples from pool
    dropExamplesFromPool();

    // (2) Add examples to pool

    // (3) Sample 1,2,3... BWS sets from pool
    // var sampled_bwssets = sampleBwsSets();
    // console.log("BWS samples 2:", sampled_bwssets);

    // // => In der App anzeigen =>
    // sampled_bwssets.forEach(exset => {
    //   var examples = []
    //   exset.forEach(key => {
    //     examples.push({
    //       "id": key,
    //       "text": pool[key].text,
    //       "spans": pool[key].span
    //     });
    //   });
    //   data.queue.push({
    //     set_id: "random-uuid-alkla",
    //     lemmata: "comma,sep,list",
    //     examples: examples
    //   })
    // })

    // => Ergebnisse verarbeiten =>

    // (4) Update pairs comparison matrix

    // (5) Compute the new target scores
    // computeTrainingScores(pairs, pool, smoothing_method.value, ema_alpha.value);

    // (6) Re-train the ML model

    // (7) Predict the new model scores for the whole pool

    return { 
      data, 
      nextExampleSet,
      onSearchLemmata,
      message_suggestion
    }
  },

});
</script>

