<template>
  <section class="section" id="settings">
    <div class="container">
      <!-- put the following into components ... -->
      <h1 class="title">{{ t('settings.settings') }}</h1>

      <h2 class="subtitle">{{ t('settings.appearance') }}</h2>
      <DarkmodeToggle v-bind:label="t('settings.darkmode')" />

      <!-- put the above into components ... -->
    </div>
  </section>
</template>


<script>
import DarkmodeToggle from '@/components/DarkmodeToggle.vue';
import { useI18n } from 'vue-i18n';


export default {
  name: "Settings",

  components: {
    DarkmodeToggle
  },

  setup(){
    const { t, locale } = useI18n();
    return { t, locale }
  },
}
</script>
