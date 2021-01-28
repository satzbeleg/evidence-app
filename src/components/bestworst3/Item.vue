<template>
  <a v-on:click="onClick">
    <div class="card is-quarter" v-bind:id="sentId" :class="stateCss">
      <div class="card-content">
        <div class="content center">
          <div v-fit2box="sentText" class="fixed-box">
            <div v-html="highlightSpans(sentText, lemmaSpans, 'span', 'tag is-success is-light is-rounded reset-to-parent-font-height')"></div>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>


<script>
import s from './enums.js';
import { defineComponent, computed } from 'vue'; 
import { highlightSpans } from '@/functions/highlight-spans.js';

export default defineComponent({
  name: "BestWorstItem",

  props: {
    itemPos: String, // item's position 
    itemState: Number, // item's states: [middle, best, worst]
    sentId: String, // SentenceID
    sentText: String,  // SentenceText
    lemmaSpans: Array
  },

  emits: ['item-selected'],

  setup(props, { emit } ){

    async function onClick(evt){
      // console.log("[INFO] Item.vue: ", evt); // see Choices.vue: onTransition
      emit('item-selected', evt, props.itemPos, props.itemState)
    }

    const stateCss = computed(() => { // change CSS class for each state
      switch(props.itemState){
        case s.BEST:  return "state-best";
        case s.WORST: return "state-worst";
        default: return "";
      }
    });

    return { onClick, stateCss, highlightSpans }
  },

});
</script>


<style scoped>
.card {
  margin-bottom: min(2vh, 25px); /* min(2vh, 25px); */
  height: 15vh; /* min(17vh, 180px); */
  /*max-width: 400px;*/
}

.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
  width: 90%;
}

.fixed-box {
  padding-top: min(2vh, 25px); /* min(3vh, 25px); */
  height: 15vh; /* min(17vh, 180px); */
  /* max-width: 400px; */
}


/** style the card depending on the state */
.state-best {
  background: hsl(141, 50%, 60%);
}

.state-worst {
  background: hsl(348, 30%, 60%);
}
</style>

<style>
/** For lemma spans; Must be global setting...*/
.reset-to-parent-font-height {
  font-size: inherit !important;
  height: inherit !important;
}
</style>

