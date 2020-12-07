export default {
  namespaced: true,

  state: () => ({
    isDarkMode: false
  }),

  mutations: {
    TOGGLE_THEME: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },

    CHANGE_THEME: (state) => {
      var elem = undefined;
      if (state.isDarkMode) {
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
    },
  },

  actions: {
    toggleTheme: (state) => {
      state.commit('TOGGLE_THEME');
      state.commit('CHANGE_THEME');
    },
    enforceTheme: (state) => {
      state.commit('CHANGE_THEME');
    }
  },

  getters: {
    isdark: (state) => {
      return state.isDarkMode
    }
  }
}