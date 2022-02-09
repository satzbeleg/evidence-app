<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />
  <section class="section" id="terms">
    <div class="container">
      <!-- put the following into components ... -->
      <div v-show="locale === 'en'"></div>
      <ImprintDE />
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";
import ImprintDE from '@/translations/pages/imprint-de.vue';


export default {
  name: "Imprint",

  components: {
    TheNavbar,
    ImprintDE
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('imprint.title');
    });

    return { t }
  }
}
</script>
