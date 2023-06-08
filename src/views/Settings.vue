<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_lemmata_search="false" />

  <section class="section" id="settings" :key="componentKey">
    <div class="container">
      <!-- put the following into components ... -->
      <GeneralSettings />
      <LegalSettings />
      <BwsSettings />
      <ResetToFactorySettings @incrementKey="() => {componentKey++}"/>
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect, ref } from "vue";
import GeneralSettings from '@/components/settings/GeneralSettings.vue';
import LegalSettings from '@/components/settings/LegalSettings.vue';
import BwsSettings from '@/components/bestworst/BwsSettings.vue';
import ResetToFactorySettings from '@/components/settings/ResetToFactorySettings.vue';

export default {
  name: "Settings",

  components: {
    TheNavbar,
    GeneralSettings,
    LegalSettings,
    BwsSettings,
    ResetToFactorySettings
  },

  setup(){
    const { t } = useI18n();

    const componentKey = ref(0);

    watchEffect(() => {
      document.title = t('settings.settings');
    });
    
    return { 
      t,
      componentKey 
    }
  },
}
</script>
