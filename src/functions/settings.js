import { ref, watch, watchEffect } from 'vue';
import { useApi } from '@/functions/axios-evidence.js';
import Cookies from 'js-cookie';


/** Sync Setting Variables with REST API
 * 
 * NOTES:
 * ------
 * - The watchers only address the syncing
 * - App-specific watchers are not part of it (e.g. `useDarkmodeToggle`)
 * 
 * EXAMPLE:
 * --------
    const { reorderpoint, orderquantity, loadSettings } = useSettings();
    async function waitForSettings(){
      await loadSettings();
      await forSomeThingElse();
      console.log(`R: ${reorderpoint.value}, Q: ${orderquantity.value}`); 
    }
    waitForSettings();
*/
export const useSettings = () => {
  // settings/appearance
  const darkmodetheme = ref();
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
          darkmodetheme.value = response.data['darkmodetheme'] || false;
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
          'darkmodetheme': darkmodetheme.value,
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
    //console.log("WATCHER: ", orderquantity.value)
    saveSettings();
  });


  return {
    loadSettings,
    saveSettings,
    darkmodetheme,
    language,
    reorderpoint,
    orderquantity
  }
}


/** App-specific watcher to toggle between light & dark theme
 * 
 * EXAMPLE:
 * --------
    import { useDarkmodeToggle } from '@/functions/settings.js';
    // in setup()
    const { darkmodetheme } = useDarkmodeToggle();
    // in template
    <input type="checkbox" v-model="darkmodetheme">
 */
export const useDarkmodeToggle = () => {
  // get reactive variable
  const { darkmodetheme } = useSettings();

  // specify toggle function
  const toggleDarkmode = () => {
    var elem = undefined;
    if (darkmodetheme.value) {
      // enable darktheme.css
      elem = document.querySelector("#dark-theme");
      if (!elem) {
        elem = document.createElement("link");
      }
      elem.setAttribute("id", "dark-theme");
      elem.setAttribute("rel", "stylesheet");
      elem.setAttribute("href", "/css/darktheme.css");
      document.querySelector("head").append(elem);
      // disable lighttheme.css
      elem = document.querySelector("#light-theme");
      if (elem) {
        let parent = elem.parentNode;
        parent.removeChild(elem);
      }
    } else {
      // enable lighttheme.css
      elem = document.querySelector("#light-theme");
      if (!elem) {
        elem = document.createElement("link");
      }
      elem.setAttribute("id", "light-theme");
      elem.setAttribute("rel", "stylesheet");
      elem.setAttribute("href", "/css/lighttheme.css");
      document.querySelector("head").append(elem);
      // disable darktheme.css
      elem = document.querySelector("#dark-theme");
      if (elem) {
        let parent = elem.parentNode;
        parent.removeChild(elem);
      }
    }
  }

  // add watcher
  watch(darkmodetheme, (x) => toggleDarkmode(x));

  return {
    toggleDarkmode,
    darkmodetheme
  }
}