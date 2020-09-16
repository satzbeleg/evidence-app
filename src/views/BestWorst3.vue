<template>
  <section class="section">
    <div class="container is-centered">
      <div v-for="(sentence, index) in example" :key="index">
        <SentenceCard v-bind:sentence="sentence.text" 
                      v-bind:identifier="sentence.id" />
      </div>
    </div>
  </section>
</template>


<script>
import SentenceCard from '@/components/SentenceCard.vue';


export default {
  name: "BestWorstTwoActions",
  
  components: {
    SentenceCard
  },

  data(){
    return {
      // An "example" is a set of four sentences
      example: [
        {"id": "123", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {"id": "45", "text": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."},
        {"id": "67", "text": "Duis aute irure dolor in  reprehenderit in voluptate velit esse cillum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."},
        {"id": "890", "text": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
      ]
    }
  },

}
</script>

