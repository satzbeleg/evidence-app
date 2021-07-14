<template>
  <div class="darkmode-icon">
    <a class="button is-rounded" v-on:click="toggleTheme()">
      <span class="icon" v-if="darkmodetheme"><i class="fas fa-moon"></i></span>
      <span class="icon" v-else><i class="fas fa-adjust"></i></span>
    </a>
  </div>
</template>


<script>
import { useDarkmodeToggle } from '@/components/settings/darkmode-toggle.js';

export default {
  name: "DarkmodeIcon",

  setup(){
    const { darkmodetheme } = useDarkmodeToggle();

    const toggleTheme = () => {
      darkmodetheme.value = !darkmodetheme.value
    }

    return { darkmodetheme, toggleTheme }
  }
}
</script>
