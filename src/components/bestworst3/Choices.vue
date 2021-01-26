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

    <div class="field is-grouped is-grouped-centered">  <!-- style="max-width: 400px;" -->
      <!-- Skip -->
      <p class="control">
      <button class="button is-rounded is-large mx-5 is-warning" v-on:click.prevent="onAbort">
        <span class="icon"><i class="fas fa-forward"></i></span>
      </button>
      </p>
  
      <!-- Ok -->
      <p class="control">
      <button class="button is-rounded is-large mx-5" 
              v-bind:class="{ 'is-success': isFinalState }" 
              v-bind:disabled="!isFinalState"
              v-on:click.prevent="onSubmit">
        <span class="icon"><i class="fas fa-check"></i></span>
      </button>
      </p>
    </div>

  </div>
</template>


<script>
import ItemCard from './Item.vue';
import s from './enums.js';
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: "BestWorstChoices",

  components: {
    ItemCard
  },

  props: {
    items: {
      type: Array,
      required: true
    }
  },

  emits: ['ranking-done'],

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

    async function logStates(evt){
      data.history.push({
        "posix-timestamp": new Date().getTime(), 
        "event-timestamp": evt.timeStamp,
        "state": Array.from(data.states) 
      });
      // console.log(data.history)
    }

    async function onTransition(evt, itemPos, itemState){
      // console.log(`[INFO] Choices.vue, onTransition: Item ${itemPos} | State ${itemState}`);
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

    async function onSubmit(evt){
      data.history.push({
        "posix-timestamp": new Date().getTime(), 
        "event-timestamp": evt.timeStamp,
        "message": "submitted" 
      });
      emit('ranking-done', Array.from(data.history))
    }

    async function onAbort(evt){
      data.history.push({
        "posix-timestamp": new Date().getTime(),
        "event-timestamp": evt.timeStamp,
        "message": "aborted"
      });
      emit('ranking-done', Array.from(data.history))
    }

    const isFinalState = computed(() => {  // damit der Submit/Ok Button auftaucht
      return data.states.some((x) => x === s.WORST)
    });

    return { data, logStates, onTransition, onSubmit, onAbort, isFinalState }
  }

});
</script>