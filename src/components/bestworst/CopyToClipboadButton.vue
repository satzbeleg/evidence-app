<template>
  <div class="field" v-if="size === 'small'">
    <button class="button is-small" @click="copy2clipboard()">
      <i class="far fa-copy"></i>
    </button>
  </div>
  <div class="field" v-else>
    <button class="button is-rounded" @click="copy2clipboard()">
      <span class="icon is-small is-left"><i class="far fa-copy"></i></span>
      <span class="is-right">Copy XML</span>
    </button>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: 'CopyToClipboadButton',

  props: {
    text: String,
    biblio: String,
    size: String,
  },

  setup(props){
    const copy2clipboard = () => {
      const xmltxt = `
<Beleg>
  <Belegtext>
    ${props.text}
  </Belegtext>
  <Fundstelle>
    <Bibl>
      ${props.biblio}
    </Bibl>
  </Fundstelle>
</Beleg>
`;
      navigator.clipboard.writeText(xmltxt);
    }

    return { 
      copy2clipboard,
    }
  }
});
</script>