<template>
  <div id="app">
    <TheNavbar/>
    <router-view/>
  </div>
</template>


<script>
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import TheNavbar from '@/components/layout/TheNavbar.vue';
import useConnToast from '@/functions/conn-toast.js';

export default {
  name: "App",

  components: {
    TheNavbar
  },

  setup(){
    useConnToast();
  }

}
</script>


<style lang="scss">
@import "~bulma/sass/utilities/_all";
@import "~bulma";
@import '~bulma-switch';
</style>


<style>
#app > .section {
  padding-top: 3.5rem;
}
</style>

