<template>
  <div id="app">
    <TheHeader/>
    <router-view />
  </div>
</template>


<script>
import TheHeader from '@/components/TheHeader.vue';
import ConnectivityDetection from '@/mixins/connectivity-detection.js';

export default {
  name: "App",
  metaInfo: {
    htmlAttrs: {
      lang: 'de',
      amp: true,
      //theme: ['light']
    },
    bodyAttrs: {
      //theme: ['dark']
    },
    title: 'Default App Title',
    titleTemplate: '%s | vue-meta Example App',
    /*meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Put the description for the Vue.js app here.' },
    ],*/
  },
  components: {
    TheHeader
  },

  mixins: [
    ConnectivityDetection
  ]
}
</script>


<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

/*
// Set your colors
$info: #f1896f;
$info-invert: findColorInvert($primary);
$twitter: #4099FF;
$twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;
*/

[theme="dark"] {
  html, body, nav, .navbar-burger, .navbar-menu, .navbar-start, .navbar-item, .navbar-link {
    background-color: $dark;
    color: $light;
  }
  h1, h2, h3, h4, h5, h6, .title, .subtitle {
    color: $light;
  }
}



// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>

