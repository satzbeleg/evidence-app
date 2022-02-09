<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />
  <section class="section" id="tips">
    <div class="container">
      <!-- put the following into components ... -->
      <div v-show="locale === 'en'"></div>
      <TipsDE />
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";
import TipsDE from '@/translations/pages/tips-de.vue';


export default {
  name: "Tips for Good Experiences",

  components: {
    TheNavbar,
    TipsDE
  },

  setup(){
    const { t, locale } = useI18n();

    watchEffect(() => {
      document.title = t('terms.title');
    });

    return { t, locale }
  }
}
</script>
