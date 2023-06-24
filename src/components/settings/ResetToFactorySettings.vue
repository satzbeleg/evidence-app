<template>
  <h1 class="title is-3 is-spaced">Danger Zone</h1>
  <div class="content">
    <p>
      <strong>Reset to factory settings</strong> will reset all settings to their default values.
      This includes the general settings, the legal settings and the BWS settings.
      We suggest <strong>reloading the web app</strong>.
      You would also need to <strong>renew the data donation license</strong> if desired.
    </p>
    <button class="button is-rounded is-danger" 
            v-on:click="factoryReset()">
      <span class="icon"><i class="fas fa-gear"></i></span>
      <strong>Factory Reset</strong>
    </button>
  </div>

</template>

<script> 
import { defineComponent } from "vue";
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
import { useI18n } from 'vue-i18n';


export default defineComponent({
  name: "ResetToFactorySettings",

  components: {
  },

  setup(props, { emit }){
    const { t } = useI18n();

    const { factoryResetGeneral } = useGeneralSettings();
    const { factoryResetBws } = useBwsSettings();

    const factoryReset = () => {
      factoryResetGeneral();
      factoryResetBws();
      emit('incrementKey');
    }
    
    return { 
      t,
      factoryReset
    }
  },
});
</script>
