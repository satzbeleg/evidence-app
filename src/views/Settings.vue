<template>
  <section class="section" id="settings">
    <div class="container">
      <!-- put the following into components ... -->
      <h1 class="title">{{ t('settings.settings') }}</h1>

      <h2 class="subtitle">{{ t('settings.appearance') }}</h2>
      <div class="field">
        <input id="darkmode-toogle" class="switch is-rounded" type="checkbox"   
               v-model="darkmodetheme">
        <label for="darkmode-toogle">{{ label }}</label>
      </div>


      <h2 class="subtitle">Offline and Sync Settings</h2>

      <div class="field">
        <input id="bestworst3-reorderpoint" class="slider is-fullwidth" type="range"   
               v-model="reorderpoint" step="1" min="1" max="20">
        <label for="bestworst3-reorderpoint">{{ reorderpoint }}</label>
      </div>

      <div class="field">
        <input id="bestworst3-orderquantity" class="slider is-fullwidth" type="range" 
               v-model="orderquantity" step="5" min="10" max="50">
        <label for="bestworst3-orderquantity">{{ orderquantity }}</label>
      </div>

      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";
import { useSettings, useDarkmodeToggle } from '@/functions/settings.js';


export default {
  name: "Settings",

  /*components: {
    DarkmodeToggle
  },*/

  setup(){
    const { t, locale } = useI18n();

    watchEffect(() => {
      document.title = t('settings.settings');
    });

    // load settings (vuex replacement)
    const { reorderpoint, orderquantity } = useSettings();
    const { darkmodetheme } = useDarkmodeToggle();
    
    return { 
      t, locale,
      darkmodetheme,
      reorderpoint, orderquantity
    }
  },
}
</script>
