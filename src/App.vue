<template>
  <div id="app">
    <TheNavbar/>
    <router-view/>
  </div>
</template>


<script>
import TheNavbar from '@/components/TheNavbar.vue';
import ConnectivityDetection from '@/mixins/connectivity-detection.js';

export default {
  name: "App",
  
  metaInfo: {
    htmlAttrs: {
      lang: 'de',
      amp: true,
    },
    bodyAttrs: {},
    title: 'Evidence Annotation App',
    titleTemplate: '%s | Evidence Annotation App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'description', content: 'Put the description for the Vue.js app here.' },
    ],
  },

  components: {
    TheNavbar
  },

  mixins: [
    ConnectivityDetection
  ]
}
</script>


<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";
// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>

<style>
#app > .section {
  padding-top: 4.5rem;
}
</style>

