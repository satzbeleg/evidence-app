<template>
  <div class="card is-quarter" v-bind:id="identifier">
    <div class="card-content">
      <div class="content center">
        <p v-scale_font_size>
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

  directives: {
    scale_font_size: {
      inserted: function(el){
        const n_len = el.textContent.length;
        const n_min_chars = 25;   // if 10 or less chars, then use 24px
        const n_max_chars = 250;  // if 250 chars, then use 8px
        const min_font_sz = 12;
        const max_font_sz = 20; // if n_len<=n_min_chars
        // min-max scaling
        const scale_factor = (n_len - n_min_chars) / (n_max_chars - n_min_chars);
        const font_size = max_font_sz - (max_font_sz - min_font_sz) * scale_factor
        el.style.fontSize = `${font_size}px`;
      }
    }
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

  height: min(18vh, 180px);
  max-width: 400px; 
}


</style>

