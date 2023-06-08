<template>
  <button class="button is-rounded is-danger" 
          v-on:click="factoryReset()">
    <span class="icon"><i class="fas fa-gear"></i></span>
    <strong>Factory Reset</strong>
  </button>

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
