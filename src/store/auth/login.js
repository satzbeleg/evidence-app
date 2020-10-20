import axios_evidence from '@/api/axios-evidence';


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

    AUTH_SUCCESS: (state, token) => {
      state.status = 'success';
      state.token = token;
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

        // convert JSON object into query string
        const params = new URLSearchParams()
        params.append('username', creds.username)
        params.append('password', creds.password)

        // start POST request. Pls note that FastAPI expect a query string
        axios_evidence.post('v1/token', params)
          .then(resp => {
            state.commit('AUTH_SUCCESS', resp.data.access_token);  // store the JWT token in Vuex
            // axios_evidence.defaults.headers.common['Authorization'] = resp.data.access_token;  // store token for all axios instances
            state.dispatch('USER_REQUEST');  // ??? What was the plan with USER_REQUEST ???
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
        state.commit('AUTH_LOGOUT');  // delete JWT token in Vuex
        // delete axios_evidence.defaults.headers.common['Authorization']; // Delete token for all axios instances
        resolve();
      });
    }
  },

  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    getToken: state => state.token
  }
}

/** Links
 * https://blog.sqreen.com/authentication-best-practices-vue/
 * https://github.com/stagerightlabs/vue-jwt-client/tree/master/src
 */