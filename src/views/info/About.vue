<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />

  <section class="section" id="about">
    <div class="container">
      <!-- put the following into components ... -->
      <div v-show="locale === 'en'"></div>
      <AboutDE />
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";
import AboutDE from '@/translations/pages/about-de.vue';


export default {
  name: "About",

  components: {
    TheNavbar,
    AboutDE
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('header.about');
    });

    return { t }
  }
}
</script>


<style scoped>
/* .column {
  display: flex;
} */
</style>