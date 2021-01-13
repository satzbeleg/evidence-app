<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />

  <div style="margin: 100px">
    <div v-fit2box="mytext" class="mybox"></div>
    <button @click="nextExample">Next</button>
  </div>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';

export default {
  name: "DemoFit2Box",

  components: {
    TheNavbar
  },

  // store
  data() {  
    return {
      myexamples: [
        "Lorem ipsum dolor sit amet",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in  reprehenderit in voluptate velit esse."
      ],
      index: 0
    }
  },

  // getters
  computed: {
    mytext(){
      return this.myexamples[this.index];
    }
  },

  methods: {
    nextExample(){
      this.index = (this.index + 1) % this.myexamples.length;
    }
  },
}
</script>

<style scoped>
.mybox {
  height: 100px;
  width: 50%;
  border: solid 1px black;
}
</style>