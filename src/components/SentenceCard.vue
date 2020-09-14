<template>
  <div class="card is-quarter" v-bind:id="identifier"
       style="cursor: pointer;" v-on:click="handlerClick">
    <div class="card-content">
      <div class="content center">
        <p v-fit2box>
          {{ sentence }}
          {{ sentence.length }}
        </p>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "SentenceCard",

  props: {
    identifier: String,
    sentence: String
  },

  // data
  // toogle message, e.g. green best example, red worst example
  
  methods: {
    handlerClick(){
      this.$emit('cardclicked', this.identifier)
    },
    // handlerClick(evt){
    //   this.$emit('cardclicked', {"id": this.identifier, "timestamp": evt.timeStamp})
    // },
  }
}
</script>


<style scoped>
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

.card {
  margin-bottom: min(3vh, 25px);
  height: min(19vh, 180px);
  max-width: 400px;
}

.card-selected {
  background: gray;
}
</style>

