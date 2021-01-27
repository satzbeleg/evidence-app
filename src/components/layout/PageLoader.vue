<template>
  <div class="pageloader is-bottom-to-top" v-bind:class="{ 'is-active' : status }">
    <div class="title">
      <div v-for="(msg, x) in messages" :key="x">{{ msg }}</div>
    </div>
  </div>
</template>


<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "PageLoader",

  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    messages: {
      type: Array,
      required: true
    }
  }
})
</script>


<style scoped>
/** offset so that it works with `TheNavbar.vue` */
.pageloader {
  z-index: 29;
  top: 3.25rem;
}
@media screen and (min-width: 1024px){
  .pageloader {top: 5.75rem;}
}

/** message settings */
.pageloader > .title {
  width: 90%;
  text-align: center;
}
</style>
