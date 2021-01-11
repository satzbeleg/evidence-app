<template>
  <!-- Keyword Search Field/Button 
    class `has-addons-fullwidth` doesn't work here
  -->
  <div class="field has-addons">
    <div class="control">  <!-- has-icons-left -->
      <!-- <span class="icon is-small is-left"><i class="fas fa-search"></i></span> -->
      <input class="input" type="text" 
             v-bind:value="keywords"
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "LemmaSearch",

  props: {
    keywords: {
      type: String,
      required: false
    }
  },

  emits: ['search-new-lemmata'],

  setup(props, {emit}){
  
    const onSearch = async() => {
      emit('search-for-new-lemmata', props.keywords);
    }

    return { onSearch }
  }
})
</script>


<style scoped>
/*.field {max-width: 480px; width: 240px;}*/
/*.field {max-width: 450px; width:80%;}*/
</style>
