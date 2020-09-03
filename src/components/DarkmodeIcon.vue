<template>
  <div class="darkmode-icon">
    <a class="button" v-on:click='toggleTheme()'>
      <b-icon v-if="isDarkMode" pack="fas" icon="moon"></b-icon>
      <b-icon v-else pack="fas" icon="adjust"></b-icon>
    </a>
  </div>
</template>


<script>
export default {
  name: "DarkmodeIcon",

  computed: {
    isDarkMode(){
      return this.$store.getters['darkmode/isdark'];
    }
  },

  methods: {
    toggleTheme(){
      this.$store.dispatch("darkmode/toggleTheme");
    }
  }

}
</script>
