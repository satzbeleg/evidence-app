<template>
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
            {{ t('menu.bestworst3') }}
          </h1>
          <div class="content">
            {{ t('menu.bestworst3_text2') }}
          </div>

          <router-link :to="{ path: '/bestworst3' }">
            <a class="button is-primary">Start</a>
          </router-link>

        </div>
      </div>

      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import { useI18n } from 'vue-i18n';
import { watchEffect } from "vue";


export default {
  name: 'Home',

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