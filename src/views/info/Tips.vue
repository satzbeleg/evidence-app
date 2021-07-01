<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />
  <section class="section" id="tips">
    <div class="container">
      <!-- put the following into components ... -->
      
      <h1 class="title is-3">{{ t('tips.title') }}</h1>
      <p></p>

      <h2 class="subtitle is-5">Lorem </h2>
      <div class="content">
        <p>ipsum</p>
      </div>

      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";


export default {
  name: "Tips for Good Experiences",

  components: {
    TheNavbar
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('terms.title');
    });

    return { t }
  }
}
</script>
