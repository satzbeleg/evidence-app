<template>
  <section class="section" id="swipe2-one-card">
    <div class="container">
      <!-- put the following into components ... -->
      <Swipe2/>
      <!-- <Swipe2Log/> -->
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import Swipe2 from '@/components/Swipe2.vue';
//import Swipe2Log from '@/components/Swipe2Log.vue';

export default {
  name: "SwipeOneCard",
  components: {
    Swipe2,
    //Swipe2Log
  }
};
</script>


<style scoped>
/* div.container {
  padding-top: 35vh;
} */
</style>