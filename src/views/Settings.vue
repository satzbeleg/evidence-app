<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_lemmata_search="false" />

  <section class="section" id="settings">
    <div class="container">
      <!-- put the following into components ... -->
      <h1 class="title is-3 is-spaced">{{ t('settings.settings') }}</h1>

      <h2 class="subtitle is-4">{{ t('settings.appearance') }}</h2>
      <div class="field">
        <input id="darkmode-toogle" class="switch is-rounded" type="checkbox"   
               v-model="darkmodetheme">
        <label for="darkmode-toogle">Darkmode</label>
      </div>
      <div class="field">
        <LanguageSwitcher />
      </div>


      <h2 class="subtitle is-4">Offline and Sync Settings</h2>
      <div class="columns">
      <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
    
      <div class="field">
        <label for="bestworst3-reorderpoint">
          Minimum Offline Example Sets
        </label>
        <input id="bestworst3-reorderpoint" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="reorderpoint" step="1" min="1" max="20">
        <output for="bestworst3-reorderpoint">{{ reorderpoint }}</output>
      </div>

      <div class="field">
        <label for="bestworst3-orderquantity">
          Number of Example Sets to Reload
        </label>
        <input id="bestworst3-orderquantity" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="orderquantity" step="5" min="10" max="50">
        <output for="bestworst3-orderquantity">{{ orderquantity }}</output>
      </div>

      </div>
      </div>
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";
import { useSettings, useDarkmodeToggle } from '@/functions/settings.js';
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";


export default {
  name: "Settings",

  components: {
    TheNavbar,
    LanguageSwitcher
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('settings.settings');
    });

    // load settings (vuex replacement)
    const { reorderpoint, orderquantity } = useSettings();
    const { darkmodetheme } = useDarkmodeToggle();
    
    return { 
      t,
      darkmodetheme, 
      reorderpoint, orderquantity
    }
  },
}
</script>
