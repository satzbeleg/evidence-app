import axios_evidence from '@/api/axios-evidence';
import Cookies from 'js-cookie';


export default {
  namespaced: true,

  state: () => ({
    status: '',
    hasLoadedOnce: false,
  }),

  mutations: {
    AUTH_REQUEST: (state) => {
      state.status = 'loading';
    },

    AUTH_SUCCESS: (state, token) => {
      state.status = 'success';
      state.hasLoadedOnce = true;
      Cookies.set('auth_token', token, { expires: 7, sameSite: 'strict' }); //{ secure: true }
      axios_evidence.defaults.headers.common['Authorization'] = token;
    },

    AUTH_ERROR: (state) => {
      state.status = 'error';
      state.hasLoadedOnce = true;
    },

    AUTH_LOGOUT: (state) => {
      state.status = 'logout';
      Cookies.remove('auth_token');
      delete axios_evidence.defaults.headers.common['Authorization'];
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
        axios_evidence.post('v1/auth/login', params)
          .then(resp => {
            state.commit('AUTH_SUCCESS', resp.data.access_token); // save JWT token in Cookie and axios
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
        state.commit('AUTH_LOGOUT'); // delete JWT token from Cookie and axios
        resolve();
      });
    }
  },

  getters: {
    isAuthenticated: () => !!Cookies.get('auth_token'),
    authStatus: state => state.status
  }
}

/** Links
 * https://blog.sqreen.com/authentication-best-practices-vue/
 * https://github.com/stagerightlabs/vue-jwt-client/tree/master/src
 * https://github.com/js-cookie/js-cookie
 */