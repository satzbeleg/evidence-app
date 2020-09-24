<template>
  <div class="darkmode-icon">
    <a class="button" v-on:click='toggleTheme()'>
      <span class="icon" v-if="isDarkMode"><i class="fas fa-moon"></i></span>
      <span class="icon" v-else><i class="fas fa-adjust"></i></span>
    </a>
  </div>
</template>


<script>
export default {
  name: "DarkmodeIcon",

  computed: {
    isDarkMode(){
      this.$store.dispatch("settings/darkmode/enforceTheme");
      return this.$store.getters['settings/darkmode/isdark'];
    }
  },

  methods: {
    toggleTheme(){
      this.$store.dispatch("settings/darkmode/toggleTheme");
    }
  }

}
</script>
