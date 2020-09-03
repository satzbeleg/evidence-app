<template>
  <div class="field darkmode-toogle">
    <b-switch v-model="isDarkMode">{{ label }}</b-switch>
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
        return this.$store.getters['darkmode/isdark'];
      },
      set(){
        this.$store.dispatch("darkmode/toggleTheme");
      }
    }
  }
}
</script>
