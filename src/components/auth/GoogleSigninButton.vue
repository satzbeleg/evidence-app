<template>
  <hr v-if="upperSeperator" 
      class="login-hr">
  <div v-if="!alwaysDisplay && showGoogleButton" 
      style="display:flex; flex-direction: column; align-items:center;">
    <div 
      class="g_id_signin" 
      data-type="standard"
      data-shape="circle"
      :data-locale="locale"
    ></div>
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
    const { t, locale } = useI18n();

    // flag if HTML tags for Google OAuth 2.0 API Javascript Client were added to `window`
    const showGoogleButton = ref(false);

    // https://developers.google.com/identity/gsi/web/guides/migration
    // https://developers.google.com/identity/gsi/web/reference/html-reference#visual-attributes
    const addGapiToWindow = () => {
      if ((typeof process.env.VUE_APP_GOOGLE_CLIENT_ID) != "undefined"){
        // load script
        let bodyScript = document.createElement("script");
        bodyScript.setAttribute("src", "https://accounts.google.com/gsi/client");
        bodyScript.setAttribute("async", "");
        bodyScript.setAttribute("defer", "");
        document.body.appendChild(bodyScript);
        // on load command
        let divGoogleClientId = document.createElement("div");
        divGoogleClientId.setAttribute("id", "g_id_onload");
        divGoogleClientId.setAttribute("data-client_id", process.env.VUE_APP_GOOGLE_CLIENT_ID);
        divGoogleClientId.setAttribute("data-callback", "handleCredentialResponse");
        document.body.appendChild(divGoogleClientId);
        // Show Google Button
        showGoogleButton.value = true;
      }
    }
    // Mount when loading
    onMounted(addGapiToWindow);


    return { t, locale, showGoogleButton }
  }
})
</script>
