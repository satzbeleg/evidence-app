import { ref, watch, watchEffect } from 'vue';
import { useApi2, useAuth } from '@/functions/axios-evidence.js';
import { useI18n } from 'vue-i18n';


/** Sync Setting Variables with REST API
 * 
 * NOTES:
 * ------
 * - The watchers only address the syncing
 * - App-specific watchers are not part of it (e.g. `useDarkmodeToggle`)
 * 
 * EXAMPLE:
 * --------
    const { reorderpoint, orderquantity, loadGeneralSettings } = useGeneralSettings();
    async function waitForSettings(){
      await loadGeneralSettings();
      await forSomeThingElse();
      console.log(`R: ${reorderpoint.value}, Q: ${orderquantity.value}`); 
    }
    waitForSettings();
*/
export const useGeneralSettings = () => {
  // declare reactive variables
  const darkmodetheme = ref();
  const language = ref();
  const hasDataDonationConsent = ref();  // Flag if data will be sent to the API
  const debugVerbose = ref();


  // `locale` is updated by language!
  const { locale } = useI18n();

  // download user settings from database
  const loadGeneralSettings = () => {
    return new Promise((resolve, reject) => {
      const { getToken } = useAuth();
      const { api } = useApi2(getToken());
      api.get(`v1/user/settings`)
        .then(response => {
          darkmodetheme.value = response.data['darkmodetheme'] || false;
          language.value = response.data['language'] || locale.value;
          hasDataDonationConsent.value = response.data['hasDataDonationConsent'] || false;
          debugVerbose.value = response.data['debugVerbose'] || false;
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
    });
  }

  // force to load data initially
  loadGeneralSettings();


  // Sync `language` and `locale`
  if (typeof language.value == "undefined") {
    language.value = locale.value
  }
  watch(
    () => language.value,
    (lang) => { locale.value = lang }
  )

  // save user settings to database
  const saveSettings = () => {
    return new Promise((resolve, reject) => {
      const { getToken } = useAuth();
      const { api } = useApi2(getToken(), "json");
      api.post(`v1/user/settings`, {
          'darkmodetheme': darkmodetheme.value,
          'language': language.value,
          'hasDataDonationConsent': hasDataDonationConsent.value,
          'debugVerbose': debugVerbose.value,
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
    });
  }

  watchEffect(() => {
    saveSettings();
  });


  return {
    loadGeneralSettings,
    saveSettings,
    darkmodetheme,
    language,
    hasDataDonationConsent,
    debugVerbose
  }
}
