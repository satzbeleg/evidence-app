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

      <div class="card is-quarter" v-for="(item, idx) in sentenceExamples" :key="idx">
        <div class="card-content">
          <div class="content center">
            <!-- <div v-fit2box="item.text" class="fixed-box"> -->
              <div v-html="highlightSpans(item.text, item.spans, 'span', 'tag is-success is-light is-rounded reset-to-parent-font-height')"></div>
            <!-- </div> -->
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
                    type="range" v-model="goodnessScore" step="0.01" min="0" max="1">
              <output for="item-sampling-numtop" style="width:3.1rem;">{{ goodnessScore }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-diversity-semantic">
                Semantic
              </label>
              <input id="item-diversity-score" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="diversitySemantic" step="0.01" min="0" max="1">
              <output for="item-sampling-numtop" style="width:3.1rem;">{{ diversitySemantic }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-diversity-syntax">
                Syntax
              </label>
              <input id="item-diversity-syntax" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="diversitySyntax" step="0.01" min="0" max="1">
              <output for="item-sampling-numtop" style="width:3.1rem;">{{ diversitySyntax }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-diversity-fingerprint">
                Fingerprint
              </label>
              <input id="item-diversity-fingerprint" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="diversityFingerprint" step="0.01" min="0" max="1">
              <output for="item-sampling-numtop" style="width:3.1rem;">{{ diversityFingerprint }}</output>
            </div>

            <div class="field">
              <label class="label" for="item-diversity-meta">
                Meta information
              </label>
              <input id="item-diversity-meta" 
                    class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                    type="range" v-model="diversityMeta" step="0.01" min="0" max="1">
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
                v-on:click="showEditModal = false">
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
import { watchEffect, ref, reactive } from "vue";
import { highlightSpans } from '@/functions/highlight-spans.js';
import { useQuadOpt } from '@/components/diversity/quadopt.js';

export default {
  name: "Find diverse sets of sentence examples",

  components: {
    TheNavbar
  },

  setup(){
    const { t } = useI18n();

    const showEditModal = ref(false);

    const goodnessScore = ref(1.0);
    const diversitySemantic = ref(0.0);
    const diversitySyntax = ref(0.0);
    const diversityFingerprint = ref(0.0);
    const diversityMeta = ref(0.0);

    const sentenceExamples = reactive([
      {"id": "123", "text": "Das Haus ist groß.", "spans": [[4, 8]]},
      {"id": "123", "text": "Das Haus war blau, aber nun gelb bevor es angemalt wurde.", "spans": [[4, 8]]},
    ]);

    watchEffect(() => {
      document.title = t('general.title');
    });

    const { aggregate_matrices, get_weights } = useQuadOpt()
    let simi1 = [
      [1, .9, .8, .7],
      [.9, 1, .6, .5],
      [.8, .6, 1, .4],
      [.7, .5, .4, 1],
    ]
    let beta1 = 2.
    let simi2 = [
      [1, .7, .8, .3],
      [.7, 1, .4, .2],
      [.8, .4, 1, .6],
      [.3, .2, .6, 1],
    ]
    let beta2 = 0.5
    let simi = aggregate_matrices(simi1, beta1, simi2, beta2)
    simi.print()

    let good = [.51, .53, .55, .57]
    let lam = 0.4
    let wbest = get_weights(good, simi, lam, undefined, 200);
    console.log(`Solution weights: ${wbest.arraySync()}`);

    return { 
      t,
      showEditModal,
      goodnessScore,
      diversitySemantic,
      diversitySyntax,
      diversityFingerprint,
      diversityMeta,
      sentenceExamples,
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