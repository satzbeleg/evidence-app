<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />
  <section class="section" id="terms">
    <div class="container">
      <!-- put the following into components ... -->
      <div v-show="locale === 'en'"></div>
      <TermsDE />
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";
import TermsDE from '@/translations/pages/terms-de.vue';

export default {
  name: "Terms of Use",

  components: {
    TheNavbar,
    TermsDE
  },

  setup(){
    const { t, locale } = useI18n();

    watchEffect(() => {
      document.title = t('terms.title');
    });

    console.log("Sprache: ", locale.value)

    return { t, locale }
  }
}
</script>
