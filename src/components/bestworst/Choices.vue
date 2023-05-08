<template>
  <div>
    <ItemCard v-for="(item, idx) in items" :key="idx"
      v-bind:itemPos="idx.toString()"
      v-bind:itemState="data.states[idx]"
      v-bind:exampleId="item.example_id"
      v-bind:sentText="item.text"
      v-bind:lemmaSpans="item.spans"
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
import ItemCard from './ItemCard.vue';
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

    var init = [];
    for (let i=0; i < props.items.length; i++){
      init.push(s.MIDDLE)
    }
    const data = reactive({
      states: init,  // initial state?
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
          data.states[itemPos] = s.WORST;  // not safe
          logStates(evt);
        }else if( data.states.some((x) => x === s.WORST) 
               && !data.states.some((x) => x === s.BEST) ){  // WORST has been selected, but not BEST 
          data.states[itemPos] = s.BEST;  // not safe
          logStates(evt);
        }
      }else if( itemState === s.WORST
             && !data.states.some((x) => x === s.BEST) ){  // UNDO 1
        data.states[itemPos] = s.MIDDLE
        logStates(evt);
      }else if( itemState === s.BEST ){  // UNDO 2
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
      return data.states.some((x) => x === s.BEST)
    });

    return { data, logStates, onTransition, onSubmit, onAbort, isFinalState }
  }

});
</script>