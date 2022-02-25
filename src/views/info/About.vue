<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />

  <section class="section" id="about">
    <div class="container">
      <!-- put the following into components ... -->
      <div v-show="locale === 'en'"><AboutEN /></div>
      <div v-show="locale === 'fr'"><AboutFR /></div>
      <div v-show="locale === 'de-leicht'"><AboutDELeicht /></div>
      <!-- default is 'de' -->
      <div v-show="['en', 'fr', 'de-leicht'].indexOf(locale) === -1"><AboutDE /></div>
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";
import AboutDE from '@/translations/pages/about-de.vue';
import AboutDELeicht from '@/translations/pages/about-de-leicht.vue';
import AboutEN from '@/translations/pages/about-en.vue';
import AboutFR from '@/translations/pages/about-fr.vue';


export default {
  name: "About",

  components: {
    TheNavbar,
    AboutDE,
    AboutDELeicht,
    AboutEN,
    AboutFR
  },

  setup(){
    const { t, locale } = useI18n();

    watchEffect(() => {
      document.title = t('header.about');
    });

    return { t, locale }
  }
}
</script>


<style scoped>
/* .column {
  display: flex;
} */
</style>