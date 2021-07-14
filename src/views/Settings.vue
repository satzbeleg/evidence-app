<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_lemmata_search="false" />

  <section class="section" id="settings">
    <div class="container">
      <!-- put the following into components ... -->
      <GeneralSettings />
      <BwsSettings />
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";
import GeneralSettings from '@/components/settings/GeneralSettings.vue';
import BwsSettings from '@/components/bestworst/BwsSettings.vue';

export default {
  name: "Settings",

  components: {
    TheNavbar,
    GeneralSettings,
    BwsSettings
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('settings.settings');
    });
    
    return { t }
  },
}
</script>
