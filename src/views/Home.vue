<template>
  <section class="section" id="home">
    <div class="container">
      <!-- put the following into components ... -->
      <div class="content">
        <h1 class="title">{{ $t('home.welcome') }}</h1>
        <p class="subtitle">{{ $t('home.welcome_text') }}</p>
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
          <router-link :to="{ path: '/best-worst-scaling' }">
            <a class="button is-primary">Start</a>
          </router-link>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <h1 class="title is-4">
            Binary Labelling
          </h1>
          <div class="content">
            Label 1 Satzbeispiel als <strong>gut</strong> (swipe right)
            oder <strong>schlecht</strong> (swipe left).
          </div>
          <router-link :to="{ path: '/binary-labelling' }">
            <a class="button is-primary">Start</a>
          </router-link>
        </div>
      </div>
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
export default {
  name: 'Home',
}
</script>
