<template>
  <div class="card is-quarter" v-bind:id="identifier">
    <div class="card-content">
      <div class="content center">
        <p v-fit-text-to-box>
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
    'scale-font-size': {  // min-max scaling
      inserted: function(el){
        const numChars = el.textContent.length;
        const minChars = 25;   // if 10 or less chars, then use 24px
        const maxChars = 250;  // if 250 chars, then use 8px
        const minFontSize = 0.8;
        const maxFontSize = 1.4; // if n_len<=n_min_chars
        const scaleFont = (numChars - minChars) / (maxChars - minChars);
        const fontSize = maxFontSize - (maxFontSize - minFontSize) * scaleFont;
        el.style.fontSize = `${fontSize}rem`;
      }
    },
    'scale-font-size2': {  // scale to box size
      inserted: function(el){
        el.style.fontSize = fitTextToBox(el);
      },
    },

  }
}


function fitTextToBox(el){
  const bh = el.closest('.card').clientHeight / 16.0;  // approx to rem units
  const bw = el.closest('.card').clientWidth / 16.0;
  const fh = 1;
  const fw = getTextWidth(el.textContent, `${fh}rem`);
  // console.log(bh, bw, bh * bw, fh, fw);
  const scaleFont = 2.0 * Math.sqrt(bh * bw) / Math.sqrt(fw);
  // console.log(scaleFont)
  const fontSize = fh * scaleFont;
  return `${fontSize}rem`;
}

function getTextWidth(text, font){
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.font = font;
  let metrics = context.measureText(text);
  return metrics.width;
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
</style>

