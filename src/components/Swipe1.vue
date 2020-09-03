
<!-- 
Implement Left/Right/Up/Down Swipe based on 
    https://www.cssscript.com/demo/detect-finger-swipe-events-javascript-pure-swipe/
Warnings
- For multiple cards use: Left/Right
-->

<template>
  <div data-swipe-threshold="20"
       data-swipe-timeout="500"
       data-swipe-ignore="false">
    Swipe now!<br>My friend!
  </div>
</template>


<script>
import 'swiped-events/dist/swiped-events.min.js';  // Swipe
import { v4 as uuid } from 'uuid';

export default {
  name: "Swipe1",
  /** Notes about destroying handlers
   * https://medium.com/swlh/7-simple-vuejs-tips-you-can-use-to-become-a-better-developer-dd423db07881
   * https://stackoverflow.com/questions/4950115/removeeventlistener-on-anonymous-functions-in-javascript
   */
  methods: {
    handlerSwipe(evt) {
      this.$store.dispatch("swipe1/addSwipe", {
        item_id: uuid(), 
        direction: evt.type, 
        timestamp: evt.timeStamp
      });
      evt.target.innerHTML = evt.type;
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
    /** swipe up */
    window.addEventListener('swiped-up', this.handlerSwipe);
    this.$on("hook:beforeDestroy", () => {
      window.removeEventListener('swiped-up', this.handlerSwipe);
    });
    /** swipe down */
    window.addEventListener('swiped-down', this.handlerSwipe);
    this.$on("hook:beforeDestroy", () => {
      window.removeEventListener('swiped-down', this.handlerSwipe);
    });
  }
}
</script>

<style scoped>
div {
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
  /* bottom: 50%; */
  height: 45vh;
  background: #191919;
  color: #eee;
  font-size: 36px;
} 
</style>
