<template>
  <section class="section" id="swipe1-like-tinder">
    <div class="container">
      <!-- put the following into components ... -->
      <Swipe1/>
      <Swipe1Log/>
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import Swipe1 from '@/components/Swipe1.vue';
import Swipe1Log from '@/components/Swipe1Log.vue';

export default {
  name: "TinderLikeSwipeView",
  components: {
    Swipe1,
    Swipe1Log
  }
};
</script>


<style scoped>
div.container {
  padding-top: 35vh;
}
</style>