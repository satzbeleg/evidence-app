<template>
  <div class="field" v-bind:for="idname + '-block'">

    <label class="label">
      {{ labeltext }}
    </label>

    <div class="dropdown" 
        v-bind:id="idname + '-block'"
        v-on:click="showDropdown = !showDropdown"
        v-bind:class="{ 'is-active': showDropdown }">
      <div class="dropdown-trigger">
        <button class="button is-rounded is-light" 
                type="button"
                aria-haspopup="true" 
                v-bind:aria-controls="idname + '-menu'">
            <span>
              {{ selectedoptiontext }}
            </span>

          <span class="icon"><i class="fas fa-caret-down"></i></span>
        </button>
      </div>

      <div class="dropdown-menu" 
           v-bind:id="idname + '-menu'" 
           role="menu">
        <div class="dropdown-content"  
             v-on:click="$emit('update:selected', $event.target.id)">
          <a v-for="option in options" :key="option.id" 
             :id="option.id" class="dropdown-item">
              {{ option.text }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { defineComponent, ref, computed } from "vue";

/**
 * BDropdown
 * 
 * Example:
 * --------
 * HTML
 *  <BDropdown idname="myid" labeltext="Dies ist ein Text" 
 *             v-model:selected="test123" 
 *             :options="[{'id': 'hey', 'text': 'Hey'}, {'id': 'ho', 'text': 'Ho'}]" />
 * JS
 *    import BDropdown from "@/components/layout/Dropdown.vue";
 *    setup(){ ...  const test123 = ref("en");  ... }
 */
export default defineComponent({
  name: "BDropdown",

  props: {
    idname: {
      type: String,
      default: 'fieldname',
      required: true
    },
    labeltext: {
      type: String,
      required: true
    },
    selected: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },

  setup(props){
    // reactive variables to toggle menu
    const showDropdown = ref(false);

    // lookup the currently selected item
    const selectedoptiontext = computed(() => {
      const res = props.options.filter(option => props.selected === option.id)
      return res.length == 1 ? res[0].text : ""
    });

    return { 
      showDropdown,
      selectedoptiontext
    }
  }
});
</script>