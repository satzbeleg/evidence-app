<template>
  <section class="section">
    <div class="container is-centered">
      <b-button v-on:click="loadNext" type="is-warning">Load Next Sentence Examples</b-button>

        <div v-for="(sentence, index) in examples" :key="index" style="border: solid 1px">
          {{ sentence.id }}
          {{ sentence.text }}
        </div>

        <!--
        <div v-for="(sentence, index) in examples" :key="index">
          <SentenceCard v-bind:sentence="sentence.text" 
                        v-bind:identifier="sentence.id"
                        v-on:cardclicked="onClickCard" />
        </div>
        -->

        <div v-if="(examples instanceof Array)">
          <SentenceCard v-bind:sentence="examples[0].text" 
                        v-bind:identifier="examples[0].id"
                        v-on:cardclicked="onClickCard" />

          <SentenceCard v-bind:sentence="examples[1].text" 
                        v-bind:identifier="examples[1].id"
                        v-on:cardclicked="onClickCard" />
        </div>

    </div>

    <h1 class="subtitle">Logging</h1>
    counter: {{ counter }} <br>
    events: <pre>{{ events }}</pre>
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
      //examples: [],
      counter: 0,
      events: [],
    }
  },

  computed: {
    examples(){
      return this.$store.getters['bestworst/current/getExamples'];
    }
  },

  methods: {
    loadNext(){
      this.$store.dispatch('bestworst/current/next');
      //this.examples = this.$store.getters['bestworst/current/getExamples'];
      this.$forceUpdate();
    },

    onClickCard(identifier){
      //console.log(identifier);
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
    },
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