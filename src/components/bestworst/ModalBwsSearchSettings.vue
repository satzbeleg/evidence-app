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
        <h2 class="subtitle is-4">Pool Size</h2>
        <div class="content">
          <template v-if="['de', 'de-leicht'].includes(language)">
            Die maximale Anzahl der Satzbeispiele, die in den Cache Ihres Geräts geladen werden.
              (Warnung: Wenn Sie 'semantisch-similar' ausgewählt haben, kann es beim Laden der Daten zu einer spürbaren Verzögerung kommen.)
          </template>
          <template v-else>
            The maximum number of sentence examples that are loaded into the cache in your device.
            (Warning: If you selected 'semantic-similar', a noticeable delay may occur while loading the data.)
          </template>
        </div>
        <div class="columns">
          <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

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
import { useGeneralSettings } from '@/components/settings/general-settings.js';


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
    const { language } = useGeneralSettings();

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
      language,
      min_pool_size,
      max_pool_size,
      onSearchHeadword
    }
  }
});

</script>

