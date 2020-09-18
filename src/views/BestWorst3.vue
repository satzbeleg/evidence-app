<template>
  <section class="section">
    <div class="container is-centered">
      <BestWorstChoices 
        v-bind:items="current"
        v-on:rankingDone="nextExample"
        :key="counter"
      />
    </div>
  </section>
</template>


<script>
import BestWorstChoices from '@/components/bestworst3/Choices.vue';
import Vue from 'vue';


export default {
  name: "BestWorstTwoActions",

  components: {
    BestWorstChoices
  },

  data(){
    return {
    /** Array with unlabelled example sets. It's a FIFO queue */
      queue: [{
          "set_id": "some-rnd-id-generated-1",
          "examples": [
            { "id": "23", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
            { "id": "34", "text": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
            { "id": "45", "text": "Duis aute irure dolor in  reprehenderit in voluptate velit esse cillum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
            { "id": "56", "text": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." }
          ]
        },
        {
          "set_id": "some-rnd-id-generated-2",
          "examples": [
            { "id": "121", "text": "Es gibt im Moment in diese Mannschaft, oh, einige Spieler vergessen ihnen Profi was sie sind. Ich lese nicht sehr viele Zeitungen, aber ich habe gehört viele Situationen. Erstens: wir haben nicht offensiv gespielt. Es gibt keine deutsche Mannschaft spielt offensiv und die Name offensiv wie Bayern. Letzte Spiel hatten wir in Platz drei Spitzen: Elber, Jancka und dann Zickler. Wir müssen nicht vergessen Zickler. Zickler ist eine Spitzen mehr, Mehmet eh mehr Basler. Ist klar diese Wörter, ist möglich verstehen, was ich hab gesagt? Danke. Offensiv, offensiv ist wie machen wir in Platz." },
            { "id": "122", "text": "Er konnte die Aufforderung stehen zu bleiben schon hören. Gehetzt sah er sich um. Plötzlich erblickte er den schmalen Durchgang. Blitzartig drehte er sich nach rechts und verschwand zwischen den beiden Gebäuden." },
            { "id": "123", "text": "Ich habe gesehen auch zwei Tage die Training. Ein Trainer ist nicht ein Idiot! Ein Trainer sei sehen was passieren in Platz. In diese Spiel es waren zwei, drei diese Spieler waren schwach wie eine Flasche leer! Haben Sie gesehen Mittwoch, welche Mannschaft hat gespielt Mittwoch? Hat gespielt Mehmet oder gespielt Basler oder hat gespielt Trapattoni? Diese Spieler beklagen mehr als sie spielen!" },
            { "id": "124", "text": "Seit 1975 fehlen in den meisten Testtexten die Zahlen, weswegen nach TypoGb. 204 § ab dem Jahr 2034 Zahlen in 86 der Texte zur Pflicht werden. Nichteinhaltung wird mit bis zu 245 € oder 368 $ bestraft." }
          ]
        },
        {
          "set_id": "some-rnd-id-generated-3",
          "examples": [
            { "id": "291", "test": "Eine wunderbare Heiterkeit hat meine ganze Seele eingenommen, gleich den süßen Frühlingsmorgen, die ich mit ganzem Herzen genieße." },
            { "id": "292", "test": "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular." },
            { "id": "293", "test": "Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt." },
            { "id": "294", "test": "Überall dieselbe alte Leier." },
          ]
        }
      ],

      // An "example" is a set of four sentences
      // example: [
      //   {"id": "123", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      //   {"id": "45", "text": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."},
      //   {"id": "67", "text": "Duis aute irure dolor in  reprehenderit in voluptate velit esse cillum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."},
      //   {"id": "890", "text": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
      // ],
      current: [undefined, undefined, undefined, undefined],

      // Use to trigger component re-rendering with :key
      counter: 1,

      // Move this to Vuex lateron
      ranked: []
    }
  },

  created(){
    const tmp = this.queue.shift();
    this.current = JSON.parse(JSON.stringify(tmp.examples))
    // this.nextChoice();
  },

  methods: {
    nextChoice(){
      const tmp = JSON.parse(JSON.stringify(this.queue.shift()));
      Array.from(tmp.examples).forEach((val, idx) => {
        Vue.set(this.current, idx, val)
      });
      console.log(tmp)
    },

    nextExample(history){ 
      // store rankings
      this.ranked.push(JSON.parse(JSON.stringify(history)));
      //console.log("Ranking is finished", JSON.parse(JSON.stringify(history)));
      //console.log(Array.from(this.ranked))

      // load next set
      this.nextChoice();
      // console.log("Check this", this.current)
      // this.$forceUpdate()

      // Force re-rendering with the :key Trick
      // it will reset "data()" in the Component
      this.counter++
      // console.log(this.counter)
    }
  }

}
</script>

