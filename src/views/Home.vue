<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />

  <section class="section" id="home">
    <div class="container">
      <!-- put the following into components ... -->
      <div class="content">
        <h1 class="title">{{ t('home.welcome') }}</h1>
        <p class="subtitle">{{ t('home.welcome_text') }}</p>
      </div>


      <div class="card">
        <div class="card-content">
          <h1 class="title is-4">
            {{ t('bestworst.title') }}
          </h1>
          <div class="content">
            {{ t('bestworst.help_long') }}
          </div>

          <router-link :to="{ path: '/bestworst4' }">
            <a class="button is-primary">Start</a>
          </router-link>

        </div>
      </div>



      <div class="card">
        <div class="card-content">
          <h1 class="title is-4">
            {{ t('variation.title') }}
          </h1>
          <div class="content">
            {{ t('variation.help_long') }}
          </div>

          <router-link :to="{ path: '/variation2' }">
            <a class="button is-primary">Start</a>
          </router-link>

        </div>
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
  name: 'Home',

  components: {
    TheNavbar
  },

  setup(){
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('home.welcome');
    });

    return { t }
  }
}
</script>


<style scoped>
.container {
  display: grid;
  grid-gap: 3vh;
}
</style>