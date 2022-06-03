<template>
  <!-- Headword Search Field/Button 
    class `has-addons-fullwidth` doesn't work here
  -->
  <div class="field has-addons has-addons-fullwidth">
    <div class="control">  <!-- has-icons-left -->
      <!-- <span class="icon is-small is-left"><i class="fas fa-search"></i></span> -->
      <input class="input is-rounded" type="text" 
             v-model="headword"
             placeholder="type the headword ...">
    </div>

    <div class="control">
      <button class="button is-rounded is-primary" type="submit" 
              v-on:click.prevent="onSearchHeadword">
        <i class="fas fa-search"></i>
        <strong class="is-hidden-mobile">&nbsp;Search</strong>
      </button>
    </div>

  </div>
</template>


<script>
import { defineComponent, ref } from "vue";


/**
 * Search field for headword
 * 
 * HTML:
 * -----
 *     <HeadwordSearch 
 *        v-bind:headword="myheadword" 
 *        v-on:search-headword-field="triggerSearch" />
 * JS:
 * ---
 *    import HeadwordSearch from "@/components/layout/HeadwordSearch.vue";
 *    import { ref } from "vue";
 *    ...
 *    components: { HeadwordSearch },
 *    ...
 *    setup(){
 *      const myheadword = ref('Stichwort1')
 *      async function triggerSearch(headword){
 *        console.log('Lemma Search clicked: ', headword) }
 *      return { triggerSearch, myheadword }
 */
export default defineComponent({
  name: "HeadwordSearch",

  props: {
    initial_headword: {
      type: String,
      required: false
    }
  },

  emits: [
    'search-headword-field'
  ],

  setup(props, {emit}){
    // set initial value if available
    const headword = ref(props.initial_headword)

    // forward search field string to parent component
    const onSearchHeadword = async() => {
      //console.log("LemmaSearch headword:", headword.value)
      emit('search-headword-field', headword.value);
    }

    return { headword, onSearchHeadword }
  }
})
</script>


<style scoped>
.field {max-width: 480px; width: 80%;}
/*.field {max-width: 450px; width:80%;}*/
</style>
