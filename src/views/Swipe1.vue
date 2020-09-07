<template>
  <section class="section" id="swipe1-like-tinder">
    <div class="container">
      <!-- put the following into components ... -->
      <Swipe1/>
      <Swipe1Log/>
      <!-- put the above into components ... -->
    </div>
    <BottomBar v-bind:items="items" v-bind:labelclass="labelclass"/>
  </section>
</template>


<script>
import Swipe1 from '@/components/Swipe1.vue';
import Swipe1Log from '@/components/Swipe1Log.vue';
import BottomBar from '@/components/BottomBar.vue';

export default {
  name: "TinderLikeSwipeView",

  components: {
    Swipe1,
    Swipe1Log,
    BottomBar
  },

  data() {
    return {
      items: [
        {'label': 'skip', 'icon': 'times', 'path': "#1" },
        {'label': 'reset', 'icon': 'sync-alt', 'path': "#2"},
        {'label': 'undo', 'icon': 'undo-alt', 'path': "#3"},
      ],
      //labelclass: "is-hidden-mobile"
    }
  }

};
</script>


<style scoped>
div.container {
  padding-top: 35vh;
}
</style>