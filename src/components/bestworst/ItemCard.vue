<template>
  <div class="card" v-bind:id="exampleId" :class="stateCss">
    <div class="flex-container">

      <div class="flex-left fit2box-height" v-on:click="onClick">
        <div class="fit2box-center" >
          <div v-fit2box="sentText" class="fit2box-padding fit2box-height">
            <div v-html="highlightSpans(sentText, lemmaSpans, 'span', 'tag is-success is-light is-rounded reset-to-parent-font-height')"></div>
          </div>
        </div>
      </div>

      <div class="flex-right" v-on:click="onMenu">
        <span class="icon"><i class="fas fa-ellipsis-v"></i></span>
      </div>

    </div>
  </div>
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
    exampleId: String, // exampleID for (lemma, sentence)
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

    async function onMenu(evt){
      emit('open-modal-example-id', evt, props.exampleId)
      console.info("[INFO] Item.vue: ", "Open Modal", props.exampleId);
    }

    return { onClick, stateCss, highlightSpans, onMenu }
  },

});
</script>


<style scoped>
.card {
  margin-bottom: min(2vh, 25px); /* min(2vh, 25px); */
  height: 15vh; /* min(17vh, 180px); */
  /*max-width: 400px;*/
}

.flex-container {
  /* background-color: red; */
  /* padding: 3px; */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.flex-left {
  /* background-color: green; */
  /* padding: 3px; */
  order: 1;
  flex-grow: 10;
}

.flex-right {
  /* background-color: yellow; */
  padding: 6px 3px 0px 12px;
  text-align: right;
  order: 2;
  flex-shrink: 10;
}

.fit2box-center {
  text-align: center;
  width: 96%;
  padding-left: 2%;
}
.fit2box-height {
  height: 15vh; /* min(17vh, 180px); */
}
.fit2box-padding {
  padding-top: min(2vh, 25px); /* min(3vh, 25px); */
}


/** style the card depending on the state */
.state-best {
  background: #3298dc;   /** 3298dc */
}

.state-worst {
  background: #ff8a65;  /** ff8a65 */
}

/** For lemma spans; Must be global setting...*/
.reset-to-parent-font-height {
  font-size: inherit !important;
  height: inherit !important;
}
</style>

