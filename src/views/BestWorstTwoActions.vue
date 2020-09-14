<template>
  <section class="section">
    <div class="container is-centered">
      <!-- <div class="column is-multiline"> -->
      <div v-for="sentence in example" :key="sentence.id">
        <a v-on:click="sendToFsm(sentence.id);">
          {{ state.matches('pickbest') }} {{ sentence.id }}
        <SentenceCard v-bind:sentence="sentence.text" 
                      v-bind:identifier="sentence.id" 
                      v-on:cardclicked="onClickCard" />
        </a>
      </div>
    </div>
    counter: {{ counter }} <br>
    context: {{ context.best_id }} <br>
    state: <pre>{{ state }}</pre>
  </section>
</template>


<script>
import SentenceCard from '@/components/SentenceCard.vue';
import { Machine, interpret } from 'xstate';
//import { useMachine } from '@xstate/vue';


/** https://xstate.js.org/viz/ */
const fsmBestWorst1 = Machine({
  id: "fsmBestWorst1",

  context: {
    selected_id: undefined,
    best_id: undefined,
    worst_id: undefined,
  },

  initial: "pickbest",

  states: {
    pickbest: {
      on: {
        NEXT: {
          target: "pickworst",
          actions: [ 
            (context) => context.best_id = context.selected_id,
            (context, event) => console.log(`[${event.type}] Best ID selected: ${context.best_id}`),
          ]
        }
      }
    },
    pickworst: {
      on: {
        UNDO: {
          target: "pickbest",
          actions: [
            (context, event) => console.log(`[${event.type}] Delete former Best ID: ${context.best_id}`),
            (context) => context.best_id = undefined
          ]
        },
        NEXT: {
          target: "submit",
          actions: [
            (context) => context.worst_id = context.selected_id,
            (context, event) => console.log(`[${event.type}] Worst ID selected: ${context.worst_id}`),
          ]
        },
      }
    },
    submit: {
      type: "final"
    }
  },


});


export default {
  name: "BestWorstTwoActions",

  components: {
    SentenceCard
  },

  /** xstate FSM, ab Vue3*/
  /*setup() {
    const { state, send } = useMachine(fsmBestWorst1);
    return {
      state, // currentState
      send
    };
  },*/

  /** xstate FSM fuer Vue2 */
  created(){
    this.fsmService
      .onTransition(state => {
        this.state = state; // update current state
      }).start()
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
      // events: [],
      /** xstate FSM fuer Vue2 */
      fsmService: interpret(fsmBestWorst1),
      state: fsmBestWorst1.initialState,
      context: fsmBestWorst1.context
    }
  },

  methods: {
    onClickCard(identifier){
      //console.log(identifier);
      // toogle card's class
      let el = document.getElementById(identifier);
      if( el.classList.contains("card-selected") ){
        el.classList.remove("card-selected");
        // this.events.push({"action": "undo", "id": identifier}); // log actions
        this.counter -= 1
      }else{
        el.classList.add("card-selected");
        // this.events.push({"action": "select", "id": identifier}); // log actions
        this.counter += 1
      }
    },
    /** xstate FSM fuer Vue2 */
    send(evt, id) {
      //console.log(evt)
      this.context.selected_id = id
      this.fsmService.send(evt);
    },
    sendToFsm(id){
      if( id === this.context.best_id ){
        this.send('UNDO');
      }else{
        this.send('NEXT', id);
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