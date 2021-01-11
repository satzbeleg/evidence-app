<template>
  <!-- Keyword Search Field/Button 
    class `has-addons-fullwidth` doesn't work here
  -->
  <div class="field has-addons has-addons-fullwidth">
    <div class="control">  <!-- has-icons-left -->
      <!-- <span class="icon is-small is-left"><i class="fas fa-search"></i></span> -->
      <input class="input" type="text" 
             v-model="keywords"
             placeholder="lemma1, lemma2, ...">
    </div>

    <div class="control">
      <button class="button is-primary" type="submit" 
              v-on:click.prevent="onSearch">
        <i class="fas fa-search"></i>
        <strong class="is-hidden-mobile">&nbsp;Search</strong>
      </button>
    </div>

  </div>
</template>


<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "LemmaSearch",

  props: {
    initial_keywords: {
      type: String,
      required: false
    }
  },

  emits: ['search-for-new-lemmata'],

  setup(props, {emit}){
    // set initial value if available
    const keywords = ref(props.initial_keywords)

    // forward `keyword` variable up the chain
    const onSearch = async() => {
      console.log("LemmaSearch keywords=", keywords.value)
      emit('search-for-new-lemmata', keywords.value);
    }

    return { keywords, onSearch }
  }
})
</script>


<style scoped>
.field {max-width: 480px; width: 80%;}
/*.field {max-width: 450px; width:80%;}*/
</style>
