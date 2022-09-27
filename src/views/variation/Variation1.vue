<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_lemmata_search="true" 
             lemma_keywords="Haus"
             v-on:search-lemmata-navbar="console.log('not implemented')" />

  <section class="section" id="terms">
    <div class="container">
      <!-- put the following into components ... -->
      
      <h1 class="title is-3">Find diverse sets of sentence examples</h1>
      <p></p>

      <div class="field is-grouped is-grouped-centered"> 
        <p class="control">
          <button class="button is-rounded is-info" 
                  v-on:click="showEditModal = true">
            <span class="icon"><i class="fas fa-filter"></i></span>
            <strong>Filter Settings</strong>
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
              w<sub>{{ item.id }}</sub>: {{ parseFloat(item.weight).toFixed(3) }} |
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
                Goodness Score (0.0 - 1.0)
              </label>
              <input id="item-goodness-score" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="lambdaTradeOff" step="0.01" min="0" max="1">
              <output for="item-sampling-numtop" style="width:3.1rem;">{{ lambdaTradeOff }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-diversity-semantic">
                Semantic
              </label>
              <input id="item-diversity-score" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="diversitySemantic" step="0.01" min="0.0" max="1.0">
              <output for="item-sampling-numtop" style="width:3.1rem;">{{ diversitySemantic }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-diversity-syntax">
                Syntax
              </label>
              <input id="item-diversity-syntax" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="diversitySyntax" step="0.01" min="0.0" max="1.0">
              <output for="item-sampling-numtop" style="width:3.1rem;">{{ diversitySyntax }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-diversity-fingerprint">
                Fingerprint
              </label>
              <input id="item-diversity-fingerprint" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="diversityFingerprint" step="0.01" min="0.0" max="1.0">
              <output for="item-sampling-numtop" style="width:3.1rem;">{{ diversityFingerprint }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-diversity-meta">
                Meta information
              </label>
              <input id="item-diversity-meta" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="diversityMeta" step="0.01" min="0.0" max="1.0">
              <output for="item-sampling-numtop" style="width:3.1rem;">{{ diversityMeta }}</output>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-rounded is-danger is-light" 
                v-on:click="showEditModal = false">
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
import { useI18n } from 'vue-i18n';
import { watchEffect, ref, reactive, watch, getCurrentInstance } from "vue";
import { highlightSpans } from '@/functions/highlight-spans.js';
import { useQuadOpt } from '@/components/variation/quadopt.js';
import { useSimilarityMatrices } from '../../components/variation/similarity-matrices';


export default {
  name: "Find diverse sets of sentence examples",

  components: {
    TheNavbar
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('general.title');
    });

    const showEditModal = ref(false);
    const recomputeMatrix = ref(false);

    const lambdaTradeOff = ref(1.0);
    const diversitySemantic = ref(1.0);
    const diversitySyntax = ref(1.0);
    const diversityFingerprint = ref(1.0);
    const diversityMeta = ref(1.0);

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

    loadSimilarityMatrices("Insel", 5);

    

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
          Object.assign(sentenceExamples, [])
          sentences.forEach((txt, idx) => {
            sentenceExamples.push({
              'text': txt, 'id': idx, 'bibl': biblio[idx],
              'good-score': good_scores[idx], 'weight': 0.0
            });
          });
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
     * - preference params changed, e.g. `diversitySemantic`
     */ 
    const { aggregate_matrices, get_weights } = useQuadOpt()

    watch(
      () => trigger_matrix_aggregation.value,
      (flag) => {
        if(flag){
          updateWeights()
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
      // aggregate similarity matrices
      let simi = aggregate_matrices(
        simi_semantic, parseFloat(diversitySemantic.value), 
        simi_grammar, parseFloat(diversitySyntax.value),
        simi_duplicate, parseFloat(diversityFingerprint.value),
        simi_biblio, parseFloat(diversityMeta.value)
      );
      // solve problem
      let wbest = get_weights(good_scores, simi, lambdaTradeOff.value, undefined, 200);
      // assign weights
      let arr = wbest.arraySync();
      sentenceExamples.forEach((d) => {
        d.weight = arr[d.id]
      });
      // force rerendering
      const instance = getCurrentInstance();
      instance?.proxy?.$forceUpdate();
    }

    return { 
      t,
      showEditModal,
      recomputeMatrix,
      lambdaTradeOff,
      diversitySemantic,
      diversitySyntax,
      diversityFingerprint,
      diversityMeta,
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