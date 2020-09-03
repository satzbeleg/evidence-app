<template>
  <section class="section" id="home">
    <div class="container">
      <!-- put the following into components ... -->
      <img alt="Vue logo" src="../assets/logo.png">
      <HelloWorld msg="Howto examples"/>
      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  metaInfo: {
    title: 'Hello World!'
  },
  components: {
    HelloWorld
  }
}
</script>
