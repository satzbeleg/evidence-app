<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />

  <section class="section" id="terms">
    <div class="container">
      <!-- put the following into components ... -->
      
      <h1 class="title is-3">Find diverse sets of sentence examples</h1>
      <p></p>

      <button class="button" v-on:click="showEditModal = true">
        <i class="fas fa-cog" />
        Filter Search
      </button>

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
        <button class="button is-success" v-on:click="showEditModal = false">Recompute</button>
        <button class="button" v-on:click="showEditModal = false">Reset</button>
        <button class="button" v-on:click="showEditModal = false">Cancel</button>
      </footer>
    </div>
  </div>

</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect, ref } from "vue";

export default {
  name: "Terms of Use",

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

    watchEffect(() => {
      document.title = t('terms.title');
    });

    return { 
      t,
      showEditModal,
      goodnessScore,
      diversitySemantic,
      diversitySyntax,
      diversityFingerprint,
      diversityMeta,
    }
  }
}
</script>
