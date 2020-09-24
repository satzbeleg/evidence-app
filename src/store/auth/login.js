// REPLACE fake api WITH axios!
//import axios from 'axios';
import apiCall from '../../api/fake-login-api';


export default {
  namespaced: true,

  state: () => ({
    token: '',
    status: '',
    hasLoadedOnce: false,
  }),

  mutations: {
    AUTH_REQUEST: (state) => {
      state.status = 'loading';
    },

    AUTH_SUCCESS: (state, resp) => {
      state.status = 'success';
      state.token = resp.token;
      state.hasLoadedOnce = true;
    },

    AUTH_ERROR: (state) => {
      state.status = 'error';
      state.hasLoadedOnce = true;
    },

    AUTH_LOGOUT: (state) => {
      state.status = 'logout';
      state.token = "";
    }
  },

  actions: {
    authRequest: (state, creds) => {
      // The Promise used for router redirect in login
      return new Promise((resolve, reject) => {
        state.commit('AUTH_REQUEST');
        apiCall({ url: 'auth', data: creds, method: 'POST' })
          .then(resp => {
            state.commit('AUTH_SUCCESS', resp)
              // REPLACE fake api WITH axios!
              //axios.defaults.headers.common['Authorization'] = resp.token; // For all axios instances
              //state.dispatch('USER_REQUEST')
            resolve(resp);
          })
          .catch(err => {
            state.commit('AUTH_ERROR', err);
            reject(err);
          });
      });
    },

    authLogout: (state) => {
      return new Promise(resolve => {
        state.commit('AUTH_LOGOUT');
        // REPLACE fake api WITH axios!
        //delete axios.defaults.headers.common['Authorization']; // Delete token for all axios instances
        resolve();
      });
    }
  },

  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
  }
}

/** Links
 * https://blog.sqreen.com/authentication-best-practices-vue/
 */