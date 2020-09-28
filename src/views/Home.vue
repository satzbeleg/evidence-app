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
            Best-Worst Scaling
          </h1>
          <div class="content">
            Es werden 4 Satzbeispiele angezeigt. 
            Markiere zuerst das <strong>beste</strong> Satzbeispiel an.
            Zum Schluß wähle noch das <strong>schlechteste</strong> Satzbeispiel aus.
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
import { watch } from "vue";


export default {
  name: 'Home',

  setup(){
    const { t } = useI18n();

    watch(() => {
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