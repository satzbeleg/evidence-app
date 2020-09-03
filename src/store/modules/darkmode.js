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
        let elem = document.createElement("link");
        elem.setAttribute("id", "dark-theme");
        elem.setAttribute("rel", "stylesheet");
        elem.setAttribute("href", "/css/darktheme.css");
        document.querySelector("head").append(elem);
      } else {
        let elem = document.querySelector("#dark-theme");
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