<template>
  <h1 v-show="showTitle" class="title is-3 is-spaced">
    {{ t('settings.legal.legal_compliance') }}
  </h1>  <!-- Rechtskonformität -->

  <h2 class="subtitle is-4">
      {{ t('settings.legal.data_donation') }}
  </h2>  <!-- Datenspende -->
  <div class="content">
    <p>{{ t('settings.legal.consent_information') }}</p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
      <div class="field">
        <input id="interactivity-datalicense-toogle" class="switch is-rounded" type="checkbox"   
               v-model="has_data_donation_consent">
        <label for="interactivity-datalicense-toogle">
          {{ t('settings.legal.consent_confirmation') }}
        </label>
      </div>
    </div>
  </div>

</template>


<script>
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n';
import { useGeneralSettings } from '@/components/settings/general-settings.js';


export default defineComponent({
  name: "Settings",

  components: {},

  props: {
    showTitle: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  setup(){
    const { t } = useI18n();

		// Load General Settings
		const { 
      language, 
      has_data_donation_consent, 
      loadGeneralSettings 
    } = useGeneralSettings();
		loadGeneralSettings();

    return { 
      t, 
      language,
			has_data_donation_consent
    }
  },
});
</script>
