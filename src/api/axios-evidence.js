//import axios_evidence from '@/api/axios-evidence'
import store from '@/store'
import axios from 'axios'


const axios_evidence = axios.create({
  //baseURL: process.env.VUE_APP_API_URL,
  baseURL: 'http://0.0.0.0:53050',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Add JWT token to header if exists
axios_evidence.interceptors.request.use((config) => {
  if ( store.getters['auth/login/isAuthenticated'] ) {
    config.headers.Authorization = `Bearer ${ store.getters['auth/login/getToken'] }`
  }
  return config
  // Do something with request error
}, error => Promise.reject(error))


export default axios_evidence
