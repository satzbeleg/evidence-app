<template>
  <div class="card" v-bind:id="exampleId" :class="stateCss">
    <div class="flex-container">

      <div class="flex-left" v-on:click="onClick">
        <div class="fit2box-center" >
          <div class="fit2box-padding">
            <div v-html="highlightSpans(sentText, lemmaSpans, 'span', 'has-text-info')"></div>
          </div>
        </div>

        <div class="is-size-7 has-text-gray-grey fit2box-center">
          {{ exampleMeta?.weight ? parseFloat(exampleMeta?.weight).toFixed(weightType == 'similarity' ? 3 : 5) : ''}}
          |
          <span class="is-italic">
            {{ exampleMeta?.context?.biblio }}
          </span>
        </div>
      </div>

      <div v-if="hasInfoModal" class="flex-right" v-on:click="showModalInformation =true">
        <span class="icon"><i class="fas fa-ellipsis-v"></i></span>
      </div>

    </div>
  </div>

  <ModalExampleInformation  
    v-if="hasInfoModal" 
    v-bind:showModalInformation="showModalInformation" 
    v-bind:exampleMeta="exampleMeta" 
    v-on:close="showModalInformation = false" 
    v-bind:weightType="weightType"
  />
</template>


<script>
import s from './enums.js';
import { defineComponent, computed, ref } from 'vue'; 
import { highlightSpans } from '@/functions/highlight-spans.js';
import ModalExampleInformation from '@/components/bestworst/ModalExampleInformation.vue';

export default defineComponent({
    name: "BestWorstItem",

    components: {
        ModalExampleInformation
    },

    props: {
        itemPos: String,
        itemState: Number,
        exampleId: String,
        sentText: String,
        lemmaSpans: Array,
        // all information about the example for the modal
        hasInfoModal: Boolean,
        exampleMeta: Object,
        weightType: String,
    },

    emits: ["item-selected"],
    
    setup(props, { emit }) {
        async function onClick(evt) {
            // console.log("[INFO] Item.vue: ", evt); // see Choices.vue: onTransition
            emit("item-selected", evt, props.itemPos, props.itemState, props.exampleId);
        }
        const stateCss = computed(() => {
            switch (props.itemState) {
                case s.BEST: return "state-best";
                case s.WORST: return "state-worst";
                default: return "";
            }
        });
        
        const showModalInformation = ref(false);

        return {
            onClick,
            stateCss,
            highlightSpans,
            showModalInformation,
        };
    },
});
</script>


<style scoped>
.card {
  margin-bottom: min(2vh, 25px); /* min(2vh, 25px); */
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

.fit2box-padding {
  padding-top: min(2vh, 25px); /* min(3vh, 25px); */
  padding-bottom: min(2vh, 25px);
}


/** style the card depending on the state */
.state-best {
  background: #3298dc;   /** 3298dc */
  color: rgb(48,48,48);
}

.state-worst {
  background: #ff8a65;  /** ff8a65 */
  color: rgb(48,48,48);
}
</style>

