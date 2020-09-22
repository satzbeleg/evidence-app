<template>
  <div>
    <ItemCard 
      itemPos="0"
      v-bind:itemState="states[0]"
      v-bind:sentId="items[0].id"
      v-bind:sentText="items[0].text"
      v-on:item-selected="onTransition"
    />

    <ItemCard 
      itemPos="1"
      v-bind:itemState="states[1]"
      v-bind:sentId="items[1].id"
      v-bind:sentText="items[1].text"
      v-on:item-selected="onTransition"
    />

    <ItemCard 
      itemPos="2"
      v-bind:itemState="states[2]"
      v-bind:sentId="items[2].id"
      v-bind:sentText="items[2].text"
      v-on:item-selected="onTransition"
    />

    <ItemCard 
      itemPos="3"
      v-bind:itemState="states[3]"
      v-bind:sentId="items[3].id"
      v-bind:sentText="items[3].text"
      v-on:item-selected="onTransition"
    />

    <b-button v-if="isFinalState" v-on:click.prevent="onSubmit">Ok</b-button>
    <b-button v-else v-on:click.prevent="onAbort">Skip</b-button>
  </div>
</template>


<script>
import Vue from 'vue';
import ItemCard from './Item.vue';
import s from './enums.js';


export default {
  name: "BestWorstChoices",

  components: {
    ItemCard
  },

  props: {
    items: Array
  },

  data(){
    return {
      states: [s.MIDDLE, s.MIDDLE, s.MIDDLE, s.MIDDLE],  // initial state?
      history: []
    }
  },

  created(){
    this.history.push({
      "posix-timestamp": new Date().getTime(), 
      "event-timestamp": window.performance.now(),
      "state": Array.from(this.states) 
    });
    // console.log(this.history)
  },

  methods: {
    logStates(evt){
      this.history.push({
        "posix-timestamp": new Date().getTime(), 
        "event-timestamp": evt.timeStamp,
        "state": Array.from(this.states) 
      });
      // console.log(this.history)
    },

    onTransition(evt, itemPos, itemState){
      console.log(`Execute the state transition here! ${itemPos}: ${itemState}`);

      // set new state
      if(itemState === s.MIDDLE){  // the previous state was MIDDLE
        if(this.states.every((x) => x === s.MIDDLE)){ // are we still in the initial state? (i.e. all are MIDDLE)
          //this.states[itemPos] = s.BEST;  // not safe
          Vue.set(this.states, itemPos, s.BEST); // then set to BEST
          this.logStates(evt);

        }else if( this.states.some((x) => x === s.BEST) 
               && !this.states.some((x) => x === s.WORST) ){  // BEST has been selected, but not WORST 
          //this.states[itemPos] = s.WORST;  // not safe
          Vue.set(this.states, itemPos, s.WORST); // then set to WORST
          this.logStates(evt);
        }
      }else if( itemState === s.BEST
             && !this.states.some((x) => x === s.WORST) ){  // UNDO 1
        Vue.set(this.states, itemPos, s.MIDDLE); 
        this.logStates(evt);

      }else if( itemState === s.WORST ){  // UNDO 2
        Vue.set(this.states, itemPos, s.MIDDLE); 
        this.logStates(evt);

      }
    },

    onSubmit(evt){
      this.history.push({
        "posix-timestamp": new Date().getTime(), 
        "event-timestamp": evt.timeStamp,
        "message": "submitted" 
      });
      this.$emit('ranking-done', Array.from(this.history))
    },

    onAbort(evt){
      this.history.push({
        "posix-timestamp": new Date().getTime(),
        "event-timestamp": evt.timeStamp,
        "message": "aborted"
      });
      this.$emit('ranking-done', Array.from(this.history))
    }
  },

  computed: {
    isFinalState(){  // damit der Submit/Ok Button auftaucht
      return this.states.some((x) => x === s.WORST)
    }
  }
}
</script>