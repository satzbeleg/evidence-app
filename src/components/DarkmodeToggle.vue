<template>
  <div class="field">
    <input id="darkmode-toogle" class="switch is-rounded" type="checkbox"  v-model="isDarkMode">
    <label for="darkmode-toogle">{{ label }}</label>
  </div>
</template>


<script>
export default {
  name: "DarkmodeToogle",

  props: {
    label: String
  },

  computed: {
    isDarkMode: {
      get(){
        return this.$store.getters['settings/darkmode/isdark'];
      },
      set(){
        this.$store.dispatch("settings/darkmode/toggleTheme");
      }
    }
  }
}
</script>
