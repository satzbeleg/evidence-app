<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_headword_search="true"
             v-bind:search_string="currentHeadword"
             v-on:search-headword-navbar="onSearchHeadword"
             :key="currentHeadword" />

  <PageLoader v-if="isLoading"
    v-bind:status="isLoading"
    v-bind:messages="['Loading Data', 'Computing similarities', 'Solve optimization problem']" />

  <section class="section" id="variation" v-else>
    <div class="container">
      <!-- put the following into components ... -->
      
      <!-- <h1 class="title is-3">Find diverse sets of sentence examples</h1> -->
      <!-- <p></p> -->

      <div class="field is-grouped is-grouped-centered" style="position: sticky; display: inline-block;"> 
        <p class="control">
          <button class="button is-rounded is-info" 
                  v-on:click="showEditModal = true">
            <span class="icon"><i class="fas fa-filter"></i></span>
            <strong>Preference Parameters</strong>
          </button>
        </p>
      </div>

      <div class="card is-quarter" 
        v-for="(item, idx) in sortByWeight(sentenceExamples)" 
        :key="idx"
      >
        <div class="card-content">
          <div class="content center">
            <!-- <div v-fit2box="item.text" class="fixed-box"> -->
              <div v-html="highlightSpans(item.text, item.spans, 'span', 'tag is-success is-light is-rounded reset-to-parent-font-height')"></div>
            <!-- </div> -->
            </div>
            <div class="content center">
            <p class="is-size-7 has-text-grey is-italic">
              w<sub>{{ item.id }}</sub>: {{ parseFloat(item.weight).toFixed(4) }} |
              {{ item.bibl }}
            </p>
          </div>
        </div>
      </div>

      <!-- put the above into components ... -->
    </div>
  </section>

  <div class="modal" :class="{ 'is-active': showEditModal }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Search Settings</p>
        <button class="delete" aria-label="close" v-on:click="showEditModal = false"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <div class="columns">
          <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
          
            <div class="field">
              <label class="label" for="item-goodness-score">
                Variation (0) vs Goodness Score (100)
              </label>
              <input id="item-goodness-score" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="lambdaTradeOff" step="0.01" min="0.01" max="0.99">
              <output for="item-goodness-score" style="width:3.1rem;">{{ lambdaTradeOff * 100 }}</output>
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

</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import PageLoader from '@/components/layout/PageLoader.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect, ref, reactive, watch, getCurrentInstance } from "vue";
import { highlightSpans } from '@/functions/highlight-spans.js';
import { useQuadOpt } from '@/components/variation/quadopt.js';
import { useSimilarityMatrices } from '../../components/variation/similarity-matrices';


export default {
  name: "Find diverse sets of sentence examples",

  components: {
    TheNavbar,
    PageLoader
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('variation.title');
    });

    const currentHeadword = ref("")
    const showEditModal = ref(false);
    const recomputeMatrix = ref(false);
    const isLoading = ref(false);

    const lambdaTradeOff = ref(.25);
    const betaSemantic = ref(.5);
    const betaGrammar = ref(.0);
    const betaDuplicate = ref(.0);
    const betaBiblio = ref(.0);
    const numExamples = ref(150)

    /* Load Data via Axios */
    const { 
      sentences,
      biblio,
      good_scores,
      simi_semantic,
      simi_grammar,
      simi_duplicate,
      simi_biblio,
      loadSimilarityMatrices,
      // simi_matrices_are_loading,
      trigger_matrix_aggregation
    } = useSimilarityMatrices();


    /* Load if new headword was submitted */
    const onSearchHeadword = async(keywords) => {
      if(keywords.length > 0){
        isLoading.value = true;
        console.log("New headword:", keywords)
        await loadSimilarityMatrices(keywords, numExamples.value);
        currentHeadword.value = keywords;
        isLoading.value = false;
      }
    }

    /* Update Cards */
    const sentenceExamples = reactive([])
    // const sentenceExamples = reactive([
    //   {"id": "123", "text": "Das Haus ist groß.", "spans": [[4, 8]]},
    //   {"id": "123", "text": "Das Haus war blau, aber nun gelb bevor es angemalt wurde.", "spans": [[4, 8]]},
    // ]);

    watch(
      () => trigger_matrix_aggregation.value,
      (flag) => {
        if (flag){
          console.group();
          console.log("Update cards");
          Object.assign(sentenceExamples, []);
          sentences.forEach((txt, idx) => {
            sentenceExamples.push({
              'text': txt, 'id': idx, 'bibl': biblio[idx],
              'good-score': good_scores[idx], 'weight': 0.0
            });
          });
          // console.log("Force rerendering");
          // const instance = getCurrentInstance();
          // instance?.proxy?.$forceUpdate();
          console.groupEnd();
        }
      }
    )

    const sortByWeight = (arr) => {
      if (arr.length > 0){
        return arr.slice().sort((a, b) => {return b.weight - a.weight})
      }
      return arr
    }

    /** Aggregate matrices if ... 
     * - new sentences in `sentenceExamples`
     * - preference params changed, e.g. `betaSemantic`
     */ 
    const { aggregate_matrices, get_weights } = useQuadOpt()

    watch(
      () => trigger_matrix_aggregation.value,
      (flag) => {
        if(flag){
          updateWeights();
          trigger_matrix_aggregation.value = false;
        }
      }
    );
    watch(
      () => recomputeMatrix.value,
      (flag) => {
        if (flag){
          updateWeights();
          recomputeMatrix.value = false;
        }
      }
    );

    const updateWeights = () => {
      // open pagerloader
      isLoading.value = true;
      console.group();
      console.log("Lambda:", parseFloat(lambdaTradeOff.value));
      console.log("Semantic:", parseFloat(betaSemantic.value));
      console.log("Grammar:", parseFloat(betaGrammar.value));
      console.log("Duplicates:", parseFloat(betaDuplicate.value));
      console.log("Bibliographic:", parseFloat(betaBiblio.value));
      console.groupEnd();
      // aggregate similarity matrices
      let simi = aggregate_matrices(
        simi_semantic, parseFloat(betaSemantic.value), 
        simi_grammar, parseFloat(betaGrammar.value),
        simi_duplicate, parseFloat(betaDuplicate.value),
        simi_biblio, parseFloat(betaBiblio.value)
      );
      simi.print();
      // solve problem
      let wbest = get_weights(
        good_scores, simi, parseFloat(lambdaTradeOff.value), undefined, 25);
      // assign weights
      let arr = wbest.arraySync();
      sentenceExamples.forEach((d) => {
        d.weight = arr[d.id]
      });
      // force rerendering
      console.log("Force rerendering")
      const instance = getCurrentInstance();
      instance?.proxy?.$forceUpdate();
      // close pagerloader
      isLoading.value = false;
    }

    return { 
      t,
      currentHeadword,
      onSearchHeadword,
      isLoading,
      showEditModal,
      recomputeMatrix,
      lambdaTradeOff,
      betaSemantic,
      betaGrammar,
      betaDuplicate,
      betaBiblio,
      numExamples,
      sentenceExamples,
      sortByWeight,
      // renderCards,
      highlightSpans
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: min(2vh, 25px); /* min(2vh, 25px); */
}
</style>