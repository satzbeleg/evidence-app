import { ref, watchEffect } from 'vue';
import { useApi } from '@/functions/axios-evidence.js';
import Cookies from 'js-cookie';


export const useSettings = () => {
  // settings/appearance
  const theme = ref();
  const language = ref();
  // settings/bestworst3
  const reorderpoint = ref();
  const orderquantity = ref();


  // download user settings from database
  const loadSettings = () => {
    return new Promise((resolve, reject) => {
      const { api } = useApi(Cookies.get('auth_token'));
      api.get(`v1/user/settings`)
        .then(response => {
          theme.value = response.data['theme'] || 'dark';
          language.value = response.data['language'] || 'de';
          reorderpoint.value = response.data['reorderpoint'] || 3;
          orderquantity.value = response.data['orderquantity'] || 10;
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
    });
  }

  // force to load data initially
  loadSettings();


  // save user settings to database
  const saveSettings = () => {
    return new Promise((resolve, reject) => {

      const { api } = useApi(Cookies.get('auth_token'));
      api.post(`v1/user/settings`, {
          'theme': theme.value,
          'language': language.value,
          'reorderpoint': reorderpoint.value,
          'orderquantity': orderquantity.value
        })
        .then(response => {
          console.log("SAVED");
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
    });
  }

  watchEffect(() => {
    console.log("WATCHER: ", orderquantity.value)
    saveSettings();
  });


  return {
    loadSettings,
    saveSettings,
    theme,
    language,
    reorderpoint,
    orderquantity
  }
}

/*
    const { reorderpoint, orderquantity, loadSettings } = useSettings();
    async function waitForSettings(){
      await loadSettings();
      await forSomeThingElse();
      console.log(`R: ${reorderpoint.value}, Q: ${orderquantity.value}`); 
    }
    waitForSettings();
*/