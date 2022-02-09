<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />
  <section class="section" id="privacy">
    <div class="container">
      <!-- put the following into components ... -->
      <div v-show="locale === 'en'"></div>
      <PrivacyDE />
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";
import PrivacyDE from '@/translations/pages/privacy-de.vue';


export default {
  name: "Privacy Policy",

  components: {
    TheNavbar,
    PrivacyDE
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('privacy.title');
    });

    return { t }
  }
}
</script>

