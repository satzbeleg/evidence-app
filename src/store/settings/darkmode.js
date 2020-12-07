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
      if (state.isDarkMode) {
        // enable darktheme.css
        let elem = document.createElement("link");
        elem.setAttribute("id", "dark-theme");
        elem.setAttribute("rel", "stylesheet");
        elem.setAttribute("href", "/css/darktheme.css");
        document.querySelector("head").append(elem);
        // disable lighttheme.css
        let elem2 = document.querySelector("#light-theme");
        if (elem2) {
          let parent = elem2.parentNode;
          parent.removeChild(elem2);
        }
      } else {
        // enable lighttheme.css
        let elem = document.createElement("link");
        elem.setAttribute("id", "light-theme");
        elem.setAttribute("rel", "stylesheet");
        elem.setAttribute("href", "/css/lighttheme.css");
        document.querySelector("head").append(elem);
        // disable darktheme.css
        let elem2 = document.querySelector("#dark-theme");
        if (elem2) {
          let parent = elem2.parentNode;
          parent.removeChild(elem2);
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