<template>
  <div class="modal" :class="{ 'is-active': showModalBwsSettings }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Search Settings</p>
        <button class="delete" aria-label="close" v-on:click="$emit('close')"></button>
      </header>
      <section class="modal-card-body" v-if="showModalBwsSettings">
        <!-- Content ... -->

        <HeadwordSearch 
          v-bind:initial_headword="search_string" 
          v-on:search-headword-field="onSearchHeadword" />

        <!-- Copied from BwsSettings.vue -->
        <h2 class="subtitle is-4">Pool Size (v4)</h2>
          <div class="content">
            <p v-if="language == 'de'">
              Die Poolgröße der lokal gespeicherten Satzbelege, Merkmalsvektoren, usw. muss eingeschränkt werden, da Endbenutzergeräte begrenzte Speicherkapazitäten haben.
            </p>
            <p v-else>
              The pool size of the locally stored sentences, feature vectors, annotation data, etc. must be constrained as end user devices have limited storage capacities.
            </p>
          </div>
          <div class="columns">
            <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

              <div class="field">
                <label class="label" for="min-pool-size">
                  Minimum Pool Size
                </label>
                <input id="min-pool-size" 
                      class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                      type="range" v-model="min_pool_size" step="10" min="10" max="1000">
                <output for="min-pool-size">{{ min_pool_size }}</output>
              </div>

              <div class="field">
                <label class="label" for="interactivity-max_pool_size">
                  Maximum Pool Size
                </label>
                <input id="interactivity-max_pool_size" 
                      class="slider has-output is-fullwidth is-primary is-circle is-medium" 
                      type="range" v-model="max_pool_size" step="10" min="20" max="1000">
                <output for="interactivity-max_pool_size">{{ max_pool_size }}</output>
              </div>

            </div>
          </div>
          <!-- Content ... -->

        

      </section>
    </div>
  </div>
</template>

<script>

import { useI18n } from 'vue-i18n';
import { defineComponent, watch,  } from "vue";
import HeadwordSearch from "@/components/layout/HeadwordSearch.vue";
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';


export default defineComponent({
  name: 'ModalBwsSearchSettings',

  components: {
    HeadwordSearch,
  },

  props: {
    showModalBwsSettings: Boolean,
    search_string: {
      type: String,
      default: undefined
    },
  },

  emits: [
    'search-headword-modal'
  ],

  setup(props, {emit}){
    const { t } = useI18n();

    // Copied from BwsSettings.vue
    const {
      min_pool_size, 
      max_pool_size,
    } = useBwsSettings();

    watch(min_pool_size, (minsz) => {
      max_pool_size.value = (max_pool_size.value <= parseInt(minsz)) ? (parseInt(minsz) + 1) : max_pool_size.value
    });
    watch(max_pool_size, (maxsz) => {
      min_pool_size.value = (min_pool_size.value >= parseInt(maxsz)) ? (parseInt(maxsz) - 1) : min_pool_size.value
    });

    // forward search field string to parent component
    const onSearchHeadword = async(keywords) => {
      emit('search-headword-modal', keywords)
      emit('close')
    }

    return { 
      t,
      min_pool_size,
      max_pool_size,
      onSearchHeadword
    }
  }
});

</script>

