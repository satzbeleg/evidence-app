<template>
  <hr v-if="upperSeperator" 
      class="login-hr">
  <div v-if="!alwaysDisplay && showGoogleButton" 
      style="display:flex; flex-direction: column; align-items:center;">
    <div class="g-signin2" data-onsuccess="onSignIn" 
         data-width="120" data-height="36"></div>
    <p v-if="showCookieWarning"
       class="is-size-7 has-text-centered" 
       style="padding-top:6px; font-style:italic;">
      {{ t('auth.google_signin_cookie_warning') }}
    </p>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: "GoogleSigninButton",

  props: {
    alwaysDisplay: {
      type: Boolean,
      default: false
    },
    upperSeperator: {
      type: Boolean,
      default: true
    },
    showCookieWarning: {
      type: Boolean,
      default: false
    }
  },

  setup(){
    // multi-lingual support
    const { t } = useI18n();

    // flag if HTML tags for Google OAuth 2.0 API Javascript Client were added to `window`
    const showGoogleButton = ref(false);

    // Add HTML tags for GAPI JS Client
    const addGapiToWindow = () => {
      if ((typeof process.env.VUE_APP_GOOGLE_CLIENT_ID) != "undefined"){
        // Set the Google OAuth 2.0 Client ID
        let metaGoogleClientId = document.createElement("meta");
        metaGoogleClientId.setAttribute("name", "google-signin-client_id");
        metaGoogleClientId.setAttribute("content", process.env.VUE_APP_GOOGLE_CLIENT_ID);
        document.head.appendChild(metaGoogleClientId);
        // Load Google's JS lib
        let externalGoogleScript = document.createElement("script");
        externalGoogleScript.setAttribute("src", "https://apis.google.com/js/platform.js");
        externalGoogleScript.setAttribute("async", "async");
        externalGoogleScript.setAttribute("defer", "defer");
        document.head.appendChild(externalGoogleScript);
        // Show Google Button
        showGoogleButton.value = true;
      }
    }
    // Mount when loading
    onMounted(addGapiToWindow);


    return { t, showGoogleButton }
  }
})
</script>
