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
import { defineComponent, reactive, watchEffect, ref } from 'vue'; // unref, watch, computed
import { useI18n } from 'vue-i18n';
//import { useApi, useAuth } from '@/functions/axios-evidence.js';
//import { useSettings } from '@/functions/settings.js';
//import { traverseObject } from '@/functions/traverse-objects.js';
//import { counting } from 'bwsample';
//import { ranking } from 'bwsample';
import { useInteractivity } from '@/components/bestworst/interactivity.js';

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

    // AJAX status flags and messages
    //const isLoadingExamples = ref(false);
    //const isSavingEvaluated = ref(false);
    const message_suggestion = ref("Not connected! Please login.");

    // Store evaluation results, pull next example set from queue, trigger re-rendering
    /**
     * nextExampleSet
     * 
     * This function contains the main procedure of the BWS UI v4.
     * 0. Store the newly evaluated BWS set 
     * 1. Drop sentence examples from the pool
     * 2. Add new sentence example to the pool from the API
     * 3. Sample new BWS sets from the pool
     * 4. Update the pairs matrix
     * 5. Re-train the model
     * 6. Predict new model scores
     */
    async function nextExampleSet(history){
      console.log("History:", history)
      // enforce rerendering via :key
      data.counter++;
    }


    // get search field string to parent component
    const onSearchLemmata = async(keywords) => {
      // reset `searchlemmata`
      searchlemmata.value = keywords      
      // delete current example set in UI
      data.current = [];
      data.current_setid = undefined;
      data.current_lemmata = undefined;
      data.queue = [];  
      // force to load next example in UI
      //await addExamplesToPool();
    }
    // load initial current BWS-exampleset
    //addExamplesToPool();




    // const stateids = ['abc', 'def', 'ghi', 'jkl'];
    // const combostates = [0, 0, 2, 1];
    // var [cnt, bw, bn, nw] = counting.direct_extract(stateids, combostates);
    // console.log(cnt, bw, bn, nw)
    // var [positions, sortedids, metrics, info] = ranking.maximize_hoaglinapprox(cnt);
    // console.log(positions, sortedids, metrics, info)

    const { 
      pool, pairs, 
      dropExamplesFromPool, drop_config, min_pool_size,
      sampleBwsSets, num_items_per_set, num_preload_bwssets, item_sampling_method,
      computeTrainingScores, smoothing_method, ema_alpha
    } = useInteractivity();

    console.log("Pairs:", pairs)
    console.log("Pool:", pool)
    // console.log(JSON.parse(JSON.stringify(pool)))


    // (1) Drop examples from pool
    dropExamplesFromPool(pairs, pool, min_pool_size.value, drop_config);

    // (2) Add examples to pool

    // (3) Sample 1,2,3... BWS sets from pool
    var sampled_bwssets = sampleBwsSets(
      pool, num_items_per_set.value, num_preload_bwssets.value, 
      item_sampling_method.value, false);
    console.log("BWS samples:", sampled_bwssets);

    // => In der App anzeigen =>

    // => Ergebnisse verarbeiten =>

    // (4) Update pairs comparison matrix

    // (5) Compute the new target scores
    computeTrainingScores(pairs, pool, smoothing_method.value, ema_alpha.value);

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

