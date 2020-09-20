<template>
  <a v-on:click="onClick" >
    <div class="card is-quarter" v-bind:id="sentId" :class="stateCss">
      {{ itemPos }}: {{ itemState }}
      <div class="card-content">
        <div class="content center">
          <div v-fit2box="sentText" class="fixed-box" ></div>
        </div>
      </div>
    </div>
  </a>
</template>


<script>
import s from './enums.js';


export default {
  name: "BestWorstItem",

  props: {
    itemPos: String, // item's position 
    itemState: Number, // item's states: [middle, best, worst]
    sentId: String, // SentenceID
    sentText: String,  // SentenceText
  },
  
  methods: {
    onClick(evt){
      this.$emit('itemSelected', evt, this.itemPos, this.itemState)
    },
  },

  computed: {
    stateCss(){ // change CSS class for each state
      switch(this.itemState){
        case s.BEST:  return "state-best";
        case s.WORST: return "state-worst";
        default: return "";
      }
    }
  }
}
</script>


<style scoped>
.card {
  margin-bottom: min(3vh, 25px);
  height: min(19vh, 180px);
  max-width: 400px;
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
  padding-top: min(3vh, 25px);
  height: min(19vh, 180px);
  max-width: 400px;
}


/** style the card depending on the state */
.state-best {
  background: hsl(141, 71%, 48%);
}

.state-worst {
  background: hsl(348, 100%, 61%);
}
</style>

