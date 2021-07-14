<template>
  <h1 class="title is-3 is-spaced">{{ t('settings.general') }}</h1>

  <h2 class="subtitle is-4">{{ t('settings.appearance') }}</h2>
  <div class="field">
    <input id="darkmode-toogle" class="switch is-rounded" type="checkbox"   
           v-model="darkmodetheme">
    <label for="darkmode-toogle">Darkmode</label>
  </div>

  <h2 class="subtitle is-4">{{ t('settings.language') }}</h2>
  <div class="field">
    <LanguageSwitcher />
  </div>

</template>


<script>
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n';
import { useDarkmodeToggle } from '@/components/settings/darkmode-toggle.js';
// import { useGeneralSettings } from '@/components/settings/general-settings.js';
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";


export default defineComponent({
  name: "Settings",

  components: {
    LanguageSwitcher
  },

  setup(){
    const { t } = useI18n();

    // load settings
    const { darkmodetheme } = useDarkmodeToggle();
    // const { darkmodetheme } = useGeneralSettings();
    
    return { 
      t,
      darkmodetheme
    }
  },
});
</script>
