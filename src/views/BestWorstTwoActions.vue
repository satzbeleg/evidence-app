<template>
  <section class="section">
    <div class="container is-centered">
      <!-- <div class="column is-multiline"> -->
        <SentenceCard v-for="sent in example" :key="sent.id"
                      v-bind:sentence="sent.text" 
                      v-bind:identifier="sent.id" 
                      v-on:cardclicked="onClickCard"/>
    <!-- </div> -->
    </div>
    {{ counter }}
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
      example: [
        {"id": "123", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
        {"id": "45", "text": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."},
        {"id": "67", "text": "Duis aute irure dolor in  reprehenderit in voluptate velit esse cillum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."},
        {"id": "890", "text": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
      ],
      counter: 0,
      events: []
    }
  },

  methods: {
    onClickCard(identifier){
      console.log(identifier);
      // toogle card's class
      let el = document.getElementById(identifier);
      if( el.classList.contains("card-selected") ){
        el.classList.remove("card-selected");
        this.events.push({"action": "undo", "id": identifier}); // log actions
        this.counter -= 1
      }else{
        el.classList.add("card-selected");
        this.events.push({"action": "select", "id": identifier}); // log actions
        this.counter += 1
      }
    }
  }
}
</script>


<style scoped>
.container {
  /* display: grid;
  grid-gap: min(3vh, 25px); 
  border: 1px solid black; */
} 
</style>