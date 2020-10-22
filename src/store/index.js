import Vuex from 'vuex';
import settings from './settings';


/** Sync Vuex states with browser's localStorage */
import VuexPersist from 'vuex-persist';
import localForage from 'localforage'
const vuexStorage = new VuexPersist({
  key: 'vuex-evidence', // name of the store in storage API
  // storage: window.localStorage,
  storage: localForage, // alternative is 'window.localStorage'
  asyncStorage: true, // required for localForage, see https://github.com/championswimmer/vuex-persist/issues/117#issuecomment-493906644
});


const store = Vuex.createStore({
  modules: {
    settings: settings,
  },
  plugins: [vuexStorage.plugin]
});


export default store;