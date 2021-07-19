<template>
  <!-- Keyword Search Field/Button 
    class `has-addons-fullwidth` doesn't work here
  -->
  <div class="field has-addons has-addons-fullwidth">
    <div class="control">  <!-- has-icons-left -->
      <!-- <span class="icon is-small is-left"><i class="fas fa-search"></i></span> -->
      <input class="input is-rounded" type="text" 
             v-model="keywords"
             placeholder="lemma1, lemma2, ...">
    </div>

    <div class="control">
      <button class="button is-rounded is-primary" type="submit" 
              v-on:click.prevent="onSearchLemmata">
        <i class="fas fa-search"></i>
        <strong class="is-hidden-mobile">&nbsp;Search</strong>
      </button>
    </div>

  </div>
</template>


<script>
import { defineComponent, ref } from "vue";


/**
 * Search field for lemmata
 * 
 * HTML:
 * -----
 *     <LemmaSearch v-bind:keywords="mylemmata" 
 *        v-on:search-for-new-lemmata="triggerSearch" />
 * JS:
 * ---
 *    import LemmaSearch from "@/components/layout/LemmaSearch.vue";
 *    import { ref } from "vue";
 *    ...
 *    components: {LemmaSearch},
 *    ...
 *    setup(){
 *      const mylemmata = ref('Stichwort1, Mehr Worte')
 *      async function triggerSearch(keywords){
 *        console.log('Lemma Search clicked: ', keywords) }
 *      return { triggerSearch, mylemmata }
 */
export default defineComponent({
  name: "LemmaSearch",

  props: {
    initial_keywords: {
      type: String,
      required: false
    }
  },

  emits: [
    'search-lemmata-field'
  ],

  setup(props, {emit}){
    // set initial value if available
    const keywords = ref(props.initial_keywords)

    // forward search field string to parent component
    const onSearchLemmata = async() => {
      //console.log("LemmaSearch keywords:", keywords.value)
      emit('search-lemmata-field', keywords.value);
    }

    return { keywords, onSearchLemmata }
  }
})
</script>


<style scoped>
.field {max-width: 480px; width: 80%;}
/*.field {max-width: 450px; width:80%;}*/
</style>
