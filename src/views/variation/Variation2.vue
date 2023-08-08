<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_headword_search="true"
             v-bind:search_string="search_headword"
             v-on:search-headword-navbar="onSearchHeadword"
             :key="search_headword" />


  <section v-if="Object.keys(pool).length > 0 && !isLoadingData && !isPredictingScores && !isComputingSimilarities"
    class="section" id="variation"
  >
    <div class="container is-centered" style="max-width: 1440px;">
      <!-- put the following into components ... -->
      
      <!-- <h1 class="title is-3">Find diverse sets of sentence examples</h1> -->
      <!-- <p></p> -->

      <div 
        class="field is-grouped is-grouped-centered" 
        style="position: sticky; display: inline-block;"
        v-if="pool"
      > 
        <p class="control">
          <button class="button is-rounded is-info" 
                  v-on:click="showEditModal = true">
            <span class="icon"><i class="fas fa-filter"></i></span>
            <strong>Preference Parameters</strong>
          </button>
        </p>
      </div>

      <ItemCard v-for="(item, idx) in sortedPool" :key="idx"
        v-bind:itemPos="idx.toString()"
        v-bind:exampleId="item.example_id"
        v-bind:sentText="item.text"
        v-bind:lemmaSpans="item.spans"
        v-bind:hasInfoModal="true"
        v-bind:exampleMeta="item"
        v-bind:itemState="item?.example_id === selectedExampleId ? 2 : 0"
        v-on:item-selected="onSelection"
      />

      <!-- put the above into components ... -->
    </div>
  </section>

  <div class="modal" :class="{ 'is-active': showEditModal }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ !selectedExampleId ? "Optimization Problem" : "Similarity Search" }}
        </p>
        <button class="delete" aria-label="close" v-on:click="showEditModal = false"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <div class="columns">
          <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
          
            <div class="field" v-if="!selectedExampleId">
              <label class="label" for="item-goodness-score">
                Variation (0) vs Goodness Score (100)
              </label>
              <input id="item-goodness-score" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="lambdaTradeOff" step="0.01" min="0.01" max="0.99">
              <output for="item-goodness-score" style="width:3.1rem;">{{ lambdaTradeOff * 100 }}</output>
            </div>

            <div class="field"  v-if="selectedExampleId">
              <label class="label" >Similarity Search for a given sentence example</label>
              <p>
                example_id: {{ selectedExampleId }}
              </p>
            </div>

            <div class="field">
              <label class="label" for="item-beta-semantic">
                Semantic
              </label>
              <input id="item-beta-semantic" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="betaSemantic" step="0.01" min="0.0" max="1.0">
              <output for="item-beta-semantic" style="width:3.1rem;">{{ betaSemantic * 100 }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-beta-grammar">
                Grammar
              </label>
              <input id="item-beta-grammar" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="betaGrammar" step="0.01" min="0.0" max="1.0">
              <output for="item-beta-grammar" style="width:3.1rem;">{{ betaGrammar * 100 }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-beta-duplicate">
                Near Duplicates
              </label>
              <input id="item-beta-duplicate" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="betaDuplicate" step="0.01" min="0.0" max="1.0">
              <output for="item-beta-duplicate" style="width:3.1rem;">{{ betaDuplicate * 100 }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-beta-biblio">
                Bibliographic
              </label>
              <input id="item-beta-biblio" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="betaBiblio" step="0.01" min="0.0" max="1.0">
              <output for="item-beta-biblio" style="width:3.1rem;">{{ betaBiblio * 100 }}</output>
            </div>


            <!-- <div class="field">
              <label class="label" for="item-num-examples">
                Number of Examples
              </label>
              <input id="item-num-examples" 
                    class="slider has-output is-fullwidth is-secondary is-circle is-medium" 
                    type="range" v-model="numExamples" step="5" min="20" max="200">
              <output for="item-num-examples" style="width:3.1rem;">{{ numExamples }}</output>
            </div> -->
          </div>
        </div>
      </section>

      <footer class="modal-card-foot">
        <button class="button is-rounded is-danger is-light" 
                v-on:click="() => {lambdaTradeOff = .25; betaSemantic = .5; betaGrammar = 0.; betaDuplicate = 0.; betaBiblio = 0.;}">
          <span class="icon"><i class="fas fa-trash"></i></span>
          <strong>Reset</strong>
        </button>
        <button class="button is-rounded is-warning is-light" 
                v-on:click="showEditModal = false">
          <!-- <span class="icon"><i class="fas fa-filter" /></span> -->
          <strong>Cancel</strong>
        </button>
        <button class="button is-rounded is-success" 
                v-on:click="() => {showEditModal = false; recomputeMatrix = true;}">
          <span class="icon"><i class="fas fa-repeat"></i></span>
          <strong>Recompute</strong>
        </button>
      </footer>
    </div>
  </div>

  <PageLoader 
    v-show="Object.keys(pool).length == 0"
    v-bind:status="true"
    v-bind:messages="['Sentence pool is empty!', 'Please search for a headword']" 
  />

  <PageLoader v-show="isLoadingData"
    v-bind:status="isLoadingData"
    v-bind:messages="['Loading data for lemma', search_headword]" 
  />

  <PageLoader v-show="isPredictingScores"
    v-bind:status="isPredictingScores"
    v-bind:messages="['Predicting model scores ...']" 
  />

  <PageLoader v-show="isComputingSimilarities"
    v-bind:status="isComputingSimilarities"
    v-bind:messages="['Computing similarities ...']" 
  />

</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import PageLoader from '@/components/layout/PageLoader.vue';
import { useI18n } from 'vue-i18n';
import { 
  watchEffect, 
  ref, 
  watch,
  // getCurrentInstance 
} from "vue";
import { highlightSpans } from '@/functions/highlight-spans.js';
import { useInteractivity } from '@/components/bestworst/interactivity.js';
import { useQueue } from '@/components/bestworst/queue.js';
import { useQuadOpt } from '@/components/variation/quadopt.js';
import { useSimilarityVectors } from '@/components/variation/similarity-vectors.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import ItemCard from '@/components/bestworst/ItemCard.vue';

export default {
  name: "Find diverse sets of sentence examples",

  components: {
    TheNavbar,
    PageLoader,
    ItemCard
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('variation.title');
    });

    const showEditModal = ref(false);
    const recomputeMatrix = ref(false);
    const isLoadingData = ref(false);
    const isPredictingScores = ref(false);
    const isComputingSimilarities = ref(false);

    const lambdaTradeOff = ref(.25);
    const betaSemantic = ref(.5);
    const betaGrammar = ref(.0);
    const betaDuplicate = ref(.0);
    const betaBiblio = ref(.0);

    // Load General UI settings
    const { 
      debug_verbose,
      loadGeneralSettings
    } = useGeneralSettings();
    loadGeneralSettings();

    // Load Interactivity Settings
    const { 
      pool,  // All examples
      resetPool,  // Only call on new headword
      addExamplesToPool,  // load new examples from API/CQL
      predictScores,  // Only call on new headword
    } = useInteractivity();

    // util functions to compute similarity vectors for each example
    const { computeSimilaries } = useSimilarityVectors();

    // Global Current Headword
    const { search_headword } = useQueue();

    /* Load if new headword was submitted */
    const onSearchHeadword = async(keywords) => {
      // delete pool and pairs matrix
      resetPool();
      // reset `search_headword`
      search_headword.value = keywords
      // load new examples from API/CQL
      isLoadingData.value = true;
      await addExamplesToPool(search_headword.value);
      isLoadingData.value = false;
      // predict scores
      isPredictingScores.value = true;
      await predictScores();
      isPredictingScores.value = false;
      // compute all similarity pairs and its scores {id1: {id2: score}}
      isComputingSimilarities.value = true;
      await computeSimilaries(pool);
      isComputingSimilarities.value = false;
      // solve optimization problem initiallly
      updateWeights();
      // console.log("pool", pool)
    }



    /** Aggregate matrices if ... 
     * - new sentences in `sentenceExamples`
     * - preference params changed, e.g. `betaSemantic`
     */ 
    const { 
      aggregate_matrices, 
      get_weights,
      norm_to_1
    } = useQuadOpt()


    // Specify matrices
    watch(
      () => recomputeMatrix.value,
      (flag) => {
        if (flag){
          updateWeights();
          recomputeMatrix.value = false;
        }
      }
    );

    // sort by weights in the UI
    const sortedPool = ref([]);
    const sortPool = (obj) => {
      let arr = Object.values(obj) 
      if (arr.length > 0){
        sortedPool.value = arr.slice().sort((a, b) => {return b.weight - a.weight})
      }
    }

    const updateWeights = () => {
      if(debug_verbose.value){
        console.group();
        console.log("Lambda:", parseFloat(lambdaTradeOff.value));
        console.log("Semantic:", parseFloat(betaSemantic.value));
        console.log("Grammar:", parseFloat(betaGrammar.value));
        console.log("Duplicates:", parseFloat(betaDuplicate.value));
        console.log("Bibliographic:", parseFloat(betaBiblio.value));
        console.groupEnd();
      }

      // extract data from pool
      let numSamples = Object.keys(pool).length;
      let good_scores = new Array(numSamples);
      let simi_semantic = new Array(numSamples);
      let simi_grammar = new Array(numSamples);
      let simi_duplicate = new Array(numSamples);
      let simi_biblio = new Array(numSamples);
      let i = 0;
      let j = 0;
      // let tmp = Object.values(pool); console.log("tmp", tmp)
      let orderedKeys = new Array(numSamples);
      Object.keys(pool).forEach((key1) => {
        orderedKeys[i] = key1;
        good_scores[i] = pool[key1]['last_model_score'] || 0.5;
        simi_semantic[i] = new Array(numSamples);
        simi_grammar[i] = new Array(numSamples);
        simi_duplicate[i] = new Array(numSamples);
        simi_biblio[i] = new Array(numSamples);
        j = 0;
        Object.keys(pool).forEach((key2) => {
          if(key1 === key2){
            simi_semantic[i][j] = 1.0;
            simi_grammar[i][j] = 1.0;
            simi_duplicate[i][j] = 1.0;
            simi_biblio[i][j] = 1.0;
          } else {     
            simi_semantic[i][j] = pool[key1]['similarities']['semantic'][key2];
            simi_grammar[i][j] = pool[key1]['similarities']['grammar'][key2];
            simi_duplicate[i][j] = pool[key1]['similarities']['duplicate'][key2];
            simi_biblio[i][j] = pool[key1]['similarities']['biblio'][key2];
          }
          j++;
        });
        i++;
      });
      // console.log("Good scores:", good_scores);
      // console.log("Semantic:", simi_semantic);
      // console.log("Grammar:", simi_grammar);
      // console.log("Duplicates:", simi_duplicate);
      // console.log("Bibliographic:", simi_biblio);

      // // aggregate similarity matrices
      let simi = aggregate_matrices(
        simi_semantic, parseFloat(betaSemantic.value), 
        simi_grammar, parseFloat(betaGrammar.value),
        simi_duplicate, parseFloat(betaDuplicate.value),
        simi_biblio, parseFloat(betaBiblio.value)
      );
      simi.print();

      // solve problem
      let wbest;
      if( selectedExampleId.value ){
        // sort by similarity for a given sentence
        let idxExample = orderedKeys.indexOf(selectedExampleId.value);
        if( idxExample < 0 ){
          console.log("Example not found in pool")
        }
        wbest = norm_to_1(simi.gather(idxExample))
      }else{
        // solve the optimization problem
        wbest = get_weights(
          good_scores, simi, parseFloat(lambdaTradeOff.value), undefined, 25);
      }

      // assign weights
      let arr = wbest.arraySync();
      if(debug_verbose.value){
        console.log("Weights:", arr);
      }
      let k = 0;
      orderedKeys.forEach((key) => {
        pool[key].weight = arr[k];
        k++;
      });
      sortPool(pool);

      // // force rerendering
      // console.log("Force rerendering")
      // const instance = getCurrentInstance();
      // instance?.proxy?.$forceUpdate();
    }
    

    // similarity search
    const selectedExampleId = ref("");

    async function onSelection(evt, itemPos, itemState, exampleId){
      selectedExampleId.value = itemState === 2 ? "" : (itemState === 0 ? exampleId : "");
    }


    return { 
      t,
      search_headword,
      onSearchHeadword,
      isLoadingData, isPredictingScores, isComputingSimilarities,
      showEditModal,
      recomputeMatrix,
      lambdaTradeOff,
      betaSemantic, betaGrammar, betaDuplicate, betaBiblio,
      pool, sortedPool, //sortByWeight,
      // renderCards,
      highlightSpans,
      // similarity search
      selectedExampleId, onSelection,
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: min(2vh, 25px); /* min(2vh, 25px); */
}
</style>