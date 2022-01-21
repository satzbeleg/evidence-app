<template>
  <h1 class="title is-3 is-spaced">{{ t('settings.general') }}</h1>


  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label">
          {{ t('settings.language') }}
        </label>
        <LanguageSwitcher />
      </div>

      <div class="field">
        <label class="label">
          {{ t('settings.appearance') }}
        </label>
        <input id="darkmode-toogle" 
               class="switch is-rounded" 
               type="checkbox"   
               v-model="darkmodetheme">
        <label for="darkmode-toogle">
          Darkmode
        </label>
      </div>

      <div class="field">
        <label class="label">
          Debugging Information
        </label>
        <input id="interactivity-debug_verbose-toogle" class="switch is-rounded" type="checkbox"   
               v-model="debug_verbose">
        <label for="interactivity-debug_verbose-toogle">
          Print details to <code>console.log</code>
        </label>
      </div>

    </div>
  </div>


</template>


<script>
import { defineComponent, ref, watch } from "vue";
import { useI18n } from 'vue-i18n';
import { useDarkmodeToggle } from '@/components/settings/darkmode-toggle.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";


export default defineComponent({
  name: "Settings",

  components: {
    LanguageSwitcher
  },

  setup(){
    const { t } = useI18n();

		// Load General Settings
		const { debug_verbose, loadGeneralSettings } = useGeneralSettings();
		loadGeneralSettings();

    // this also adds an watcher
    const { darkmodetheme } = useDarkmodeToggle();

    // const test123 = ref("")
    // watch(() => test123.value, (x) => {
    //   console.log("Hey", x)
    // })
    
    return { 
      t,
      darkmodetheme,
			debug_verbose,
      // test123
    }
  },
});
</script>
