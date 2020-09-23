<template>
  <div>
    <ItemCard 
      itemPos="0"
      v-bind:itemState="data.states[0]"
      v-bind:sentId="items[0].id"
      v-bind:sentText="items[0].text"
      v-on:item-selected="onTransition"
    />

    <ItemCard 
      itemPos="1"
      v-bind:itemState="data.states[1]"
      v-bind:sentId="items[1].id"
      v-bind:sentText="items[1].text"
      v-on:item-selected="onTransition"
    />

    <ItemCard 
      itemPos="2"
      v-bind:itemState="data.states[2]"
      v-bind:sentId="items[2].id"
      v-bind:sentText="items[2].text"
      v-on:item-selected="onTransition"
    />

    <ItemCard 
      itemPos="3"
      v-bind:itemState="data.states[3]"
      v-bind:sentId="items[3].id"
      v-bind:sentText="items[3].text"
      v-on:item-selected="onTransition"
    />

    <button class="button" v-if="isFinalState" v-on:click.prevent="onSubmit">Ok</button>
    <button class="button" v-else v-on:click.prevent="onAbort">Skip</button>
  </div>
</template>


<script>
import ItemCard from './Item.vue';
import s from './enums.js';
import { reactive } from 'vue';

export default {
  name: "BestWorstChoices",

  components: {
    ItemCard
  },

  props: {
    items: Array
  },

  setup(props, { emit }){
    const data = reactive({
      states: [s.MIDDLE, s.MIDDLE, s.MIDDLE, s.MIDDLE],  // initial state?
      history: []
    });

    data.history.push({
      "posix-timestamp": new Date().getTime(), 
      "event-timestamp": window.performance.now(),
      "state": Array.from(data.states) 
    });

    function logStates(evt){
      data.history.push({
        "posix-timestamp": new Date().getTime(), 
        "event-timestamp": evt.timeStamp,
        "state": Array.from(data.states) 
      });
      // console.log(data.history)
    }

    function onTransition(evt, itemPos, itemState){
      console.log(`Execute the state transition here! ${itemPos}: ${itemState}`);
      // set new state
      if(itemState === s.MIDDLE){  // the previous state was MIDDLE
        if(data.states.every((x) => x === s.MIDDLE)){ // are we still in the initial state? (i.e. all are MIDDLE)
          data.states[itemPos] = s.BEST;  // not safe
          logStates(evt);
        }else if( data.states.some((x) => x === s.BEST) 
               && !data.states.some((x) => x === s.WORST) ){  // BEST has been selected, but not WORST 
          data.states[itemPos] = s.WORST;  // not safe
          logStates(evt);
        }
      }else if( itemState === s.BEST
             && !data.states.some((x) => x === s.WORST) ){  // UNDO 1
        data.states[itemPos] = s.MIDDLE
        logStates(evt);
      }else if( itemState === s.WORST ){  // UNDO 2
        data.states[itemPos] = s.MIDDLE
        logStates(evt);
      }
    }

    function onSubmit(evt){
      data.history.push({
        "posix-timestamp": new Date().getTime(), 
        "event-timestamp": evt.timeStamp,
        "message": "submitted" 
      });
      emit('ranking-done', Array.from(data.history))
    }

    function onAbort(evt){
      data.history.push({
        "posix-timestamp": new Date().getTime(),
        "event-timestamp": evt.timeStamp,
        "message": "aborted"
      });
      emit('ranking-done', Array.from(data.history))
    }

    function isFinalState(){  // damit der Submit/Ok Button auftaucht
      return data.states.some((x) => x === s.WORST)
    }

    return { data, logStates, onTransition, onSubmit, onAbort, isFinalState }
  }

}
</script>