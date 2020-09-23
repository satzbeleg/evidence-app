<template>
  <div id="app">
    <TheNavbar/>
    <router-view/>
  </div>
</template>


<script>
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import TheNavbar from '@/components/TheNavbar.vue';
// import ConnectivityDetection from '@/mixins/connectivity-detection.js';

export default {
  name: "App",

  components: {
    TheNavbar
  },

  // mixins: [
  //   ConnectivityDetection
  // ]
}
</script>


<style lang="scss">
@import "~bulma/sass/utilities/_all";
@import "~bulma";
@import '~bulma-switch';
</style>


<style>
#app > .section {
  padding-top: 4.5rem;
}
</style>

