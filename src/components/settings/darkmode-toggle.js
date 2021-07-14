import { watch } from 'vue';
import { useGeneralSettings } from '@/components/settings/general-settings.js';

/** App-specific watcher to toggle between light & dark theme
 * 
 * EXAMPLE:
 * --------
    import { useDarkmodeToggle } from '@/components/settings/darkmode-toggle.js';
    // in setup()
    const { darkmodetheme } = useDarkmodeToggle();
    // in template
    <input type="checkbox" v-model="darkmodetheme">
 */
export const useDarkmodeToggle = () => {
  // get reactive variable
  const { darkmodetheme } = useGeneralSettings();

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
