
<!-- 
Implement Left/Right/Up/Down Swipe based on 
    https://www.cssscript.com/demo/detect-finger-swipe-events-javascript-pure-swipe/
Warnings
- For multiple cards use: Left/Right
-->

<template>
  <div class="card"
       data-swipe-threshold="20"
       data-swipe-timeout="500"
       data-swipe-ignore="false">
    <div class="card-content">
      <div class="content">
        <span>{{ sentence }}</span>
        <br>
        <span>{{ status }}</span>
      </div>
    </div>
  </div>
</template>


<script>
import 'swiped-events/dist/swiped-events.min.js';  // Swipe
import { v4 as uuid } from 'uuid';

export default {
  name: "Swipe2",

  data(){
    return {
      sentence: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "ready to swipe"
    }
  },

  methods: {
    handlerSwipe(evt) {
      this.$store.dispatch("swipe1/addSwipe", {
        item_id: uuid(), 
        direction: evt.type, 
        timestamp: evt.timeStamp
      });
      this.status = evt.type;
      console.log(evt.type);
    } 
  },

  mounted () {
    /** swipe left */
    window.addEventListener('swiped-left', this.handlerSwipe);
    this.$on("hook:beforeDestroy", () => {
      window.removeEventListener('swiped-left', this.handlerSwipe);
    });
    /** swipe right */
    window.addEventListener('swiped-right', this.handlerSwipe);
    this.$on("hook:beforeDestroy", () => {
      window.removeEventListener('swiped-right', this.handlerSwipe);
    });
  }
}
</script>

<style scoped>
/* div {
  position: fixed;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  top: 0;
  // bottom: 50%; 
  height: 45vh;
  background: #191919;
  color: #eee;
  font-size: 36px;
}  */
</style>
