<template>
  <!-- 
      Only for mobile/tablet (is-hidden-desktop)
  -->
  <nav class="navbar is-hidden-desktop is-fixed-bottom has-shadow" role="navigation">
    <div class="navbar-brand">

      <router-link v-for="(item, index) in items" :key="`item-${index}`" 
                   :to="{ path: item.path }">
        <b-icon pack="fas" v-bind:icon="item.icon"></b-icon>
        <p v-bind:class="labelclass">{{ item.label }}</p>
      </router-link>

    </div>
  </nav>
</template>


<script>
export default {
  name: "BottomBar",

  props: {
    items: Array,
    labelclass: String
  }

  // data(){
  //   return {
  //     items: [
  //       {'label': 'skip', 'icon': 'times', 'path': "/#1" },
  //       {'label': 'reset', 'icon': 'sync-alt', 'path': "/#2"},
  //       {'label': 'undo', 'icon': 'undo-alt', 'path': "/#3"},
  //     ],
  //     labelclass: "is-hidden-mobile"
  //   }
  // }
};
</script>


<style>
/** Increase main sections's padding due to fixed bottom bar */
#app > .section {
  padding-bottom: 4.5rem;
}
</style>


<style scoped>
nav.navbar {
  display: block;
  width: 100%;
}
div.navbar-brand {
  display: inline-flex;
  justify-content: center;
  width: 100%;
}
a {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  /*border: 1px solid;*/
  padding: .5rem;
}
</style> 

