import axios from 'axios';
import Cookies from 'js-cookie';
import { ref, computed } from 'vue';
//import { useRoute } from 'vue-router';


/**
 * @param {String} endpoint 
 *    The REST API endpoint for the request
 * @param {String} token 
 *    The access token required to use the REST API endpoint
 */
export const useApi = (token) => {
  // Creat an axios api instance. 
  const api = axios.create({
    baseURL: process.env.VUE_APP_REST_PUBLIC_URL || 'http://0.0.0.0:55017',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  });
  // output variables
  return { api }
}


/**
 * Manage the Access Token
 * 
 * EXAMPLE:
 * --------
    import { useApi, useAuth } from '@/functions/axios-evidence.js';
    import router from '@/router';
    const { getToken } = useAuth();
    const token = getToken();
    if (typeof token == 'undefined') {router.push("/login");}
    const { api } = useApi(getToken());
 */
export const useAuth = () => {
  // declare reactive variables
  const jwtToken = ref(undefined);
  const authStatus = ref("not-loaded");
  const isLoading = ref(false);
  const failedLoginAttempts = ref(0);
  const verificationStatus = ref("");

  /** 
   * Legacy Login based on username/password
   */
  const loginLegacy = (username, password) => {
    return new Promise((resolve, reject) => {
      // Auth Request started
      isLoading.value = true;

      // convert JSON object into query string bcoz FastAPI expects query string
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      // start POST request
      const { api } = useApi();
      api.post('v1/auth-legacy/login', params)
        .then(resp => {
          authStatus.value = 'success'; // save JWT token in Cookie and axios
          jwtToken.value = resp.data.access_token;
          Cookies.set('auth_token', resp.data.access_token, { expires: 7, sameSite: 'strict' }); //{ secure: true }
          //api.defaults.headers.common['Authorization'] = resp.data.access_token;
          resolve(resp);
        })
        .catch(err => {
          authStatus.value = 'error';
          jwtToken.value = undefined;
          failedLoginAttempts.value += 1;
          reject(err);
        })
        .finally(() => {
          isLoading.value = false
        });
      // fin.
    });
  }

  /**
   * Email/Password based Authentication
   */
  const loginEmail = (email, password) => {
    return new Promise((resolve, reject) => {
      // Auth Request started
      isLoading.value = true;

      // convert JSON object into query string bcoz FastAPI expects query string
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      // start POST request
      const { api } = useApi();
      api.post('v1/auth/login', params)
        .then(resp => {
          authStatus.value = 'success'; // save JWT token in Cookie and axios
          jwtToken.value = resp.data.access_token;
          Cookies.set('auth_token', resp.data.access_token, { expires: 7, sameSite: 'strict' }); //{ secure: true }
          //api.defaults.headers.common['Authorization'] = resp.data.access_token;
          resolve(resp);
        })
        .catch(err => {
          authStatus.value = 'error';
          jwtToken.value = undefined;
          failedLoginAttempts.value += 1;
          reject(err);
        })
        .finally(() => {
          isLoading.value = false
        });
      // fin.
    });
  }

  /**
   * Email/Password based Authentication
   */
   const signupEmail = (email, password) => {
    return new Promise((resolve, reject) => {
      // Auth Request started
      isLoading.value = true;

      // convert JSON object into query string bcoz FastAPI expects query string
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      // start POST request
      const { api } = useApi();
      api.post('v1/auth/register', params)
        .then(resp => {
          console.log(resp)
          resolve(resp);
        })
        .catch(err => {
          console.log(err)
          reject(err);
        })
        .finally(() => {
        });
      // fin.
    });
  }

  /**
   * Email Verification
   */
   const verifyEmail = (verifyToken) => {
    return new Promise((resolve, reject) => {
      // get the verfication token from dynamic routing
      console.log("Verify Token: ", verifyToken);
      //console.log(verificationStatus.value);

      // start GET request
      const { api } = useApi();
      api.get('v1/auth/verify/' + verifyToken)
        .then(resp => {
          verificationStatus.value = resp.status;
          console.log(resp)
          resolve(resp);
        })
        .catch(err => {
          verificationStatus.value = "api-not-reachable";
          console.log(err)
          reject(err);
        })
        .finally(() => {
        });
      // fin.
      console.log(verificationStatus.value);
    });
  }


  /**
   * Logout -- Delete Access Token 
   */
  const logout = () => {
    return new Promise(resolve => {
      authStatus.value = 'logout'; // delete JWT token from Cookie and axios
      jwtToken.value = undefined;
      Cookies.remove('auth_token');
      //delete api.defaults.headers.common['Authorization'];
      resolve();
    });
  }

  const getToken = () => {
    jwtToken.value = Cookies.get('auth_token');
    return jwtToken.value;
  }
  getToken();

  const isAuthenticated = computed(() => !!jwtToken.value);

  return {
    loginLegacy,
    loginEmail,
    logout,
    getToken,
    isAuthenticated,
    authStatus,
    isLoading,
    failedLoginAttempts,
    signupEmail,
    verifyEmail
  }
}
