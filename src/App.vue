<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<script>
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import useConnToast from '@/functions/conn-toast.js';

export default {
  name: "App",

  setup(){
    useConnToast();
  }

}
</script>


<style lang="scss">
@import "~bulma/sass/utilities/_all";
@import "~bulma";
@import '~bulma-switch';
@import '~bulma-slider';
</style>


<style>
/*#app > .section {
  padding-top: 3.5rem;
}*/
</style>

