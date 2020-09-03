export default {
  namespaced: true,

  state: () => ({
    isDarkMode: false
  }),

  mutations: {
    TOGGLE_THEME: (state) => {
      state.isDarkMode = !state.isDarkMode;
      // is this OK???
      let elem = document.documentElement;
      if (state.isDarkMode) {
        elem.setAttribute("theme", "dark");
      } else {
        elem.setAttribute("theme", "light");
      }
    },
  },

  actions: {
    toggleTheme: (state) => {
      state.commit('TOGGLE_THEME');
    }
  },

  getters: {
    isdark: (state) => {
      return state.isDarkMode
    }
  }
}