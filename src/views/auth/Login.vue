<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />

  <section class="hero is-info is-fullheight-with-navbar" id="login">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">

            <div v-if="error" class="error">{{ error.message }}</div>

            <h3 class="title">{{ t('auth.login_noun') }}</h3>
            <hr class="login-hr">
            <p class="subtitle">{{ t('auth.login_cta') }}</p>

            <form @submit.prevent="onLogin" class="box form">

              <div class="field">
                <label class="label">{{ t('auth.email') }}</label>
                <p class="control has-icons-left has-icons-right">
                  <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
                  <input class="input is-rounded" type="text" 
                        autocorrect="off" autocapitalize="off" spellcheck="false"
                        v-model="email"
                        v-bind:placeholder="t('auth.email_place')">
                </p>
              </div>

              <div class="field">
                <label class="label">{{ t('auth.password') }}</label>
                <p class="control has-icons-left has-icons-right">
                  <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
                  <input class="input is-rounded" 
                        type="password"
                        v-model="password" 
                        v-bind:placeholder="t('auth.password_place')">
                </p>
              </div>
            
              <div class="field">
                <p class="control">
                  <button class="button is-rounded is-primary" type="submit">
                    <strong>{{ t('auth.login') }}</strong>
                    <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                  </button>
                </p>
              </div>

              <div class="is-size-7 has-text-danger" v-show="authStatus === 'error'">
                E-Mail or Password wrong!
              </div>

            </form>

            <span style="display:flex;justify-content:space-between;">
              <router-link :to="{ path: '/auth/signup' }">Register new account</router-link>
              <!-- PW Reset REST API not implemented. -->
              <!-- <router-link :to="{ path: '/auth/recovery' }">Reset password </router-link> -->
            </span>

            <GoogleSigninButton v-bind:alwaysDisplay="false"
                                v-bind:upperSeperator="true"
                                v-bind:showCookieWarning="true" />

          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { defineComponent, ref, watchEffect } from "vue";
import router from '@/router';
import { useRoute } from 'vue-router';
import { useAuth } from '@/functions/axios-evidence.js';
import GoogleSigninButton from '@/components/auth/GoogleSigninButton.vue';


export default defineComponent({
  name: "Login",

  components: {
    TheNavbar,
    GoogleSigninButton
  },

  setup(){
    // multi-lingual support
    const { t, locale } = useI18n();

    watchEffect(() => {
      document.title = t('auth.login_noun');
    });

    // process submitted login request
    const { loginEmail, gapiSignIn, authStatus } = useAuth(); 
    const email = ref("");
    const password = ref("");

    // read URL query string
    const route = useRoute();

    const onLogin = async () => {
      try{
        await loginEmail(email.value, password.value);
        router.push(route.query.redirect || '/');
      }catch(err){
        console.log(err);
      }
    }    

    window.onGoogleSignIn = async (googleUser) => {
      try{
        await gapiSignIn(googleUser);
        router.push(route.query.redirect || '/');
      }catch(err){
        console.log(err);
      }
    }

    return { t, locale, email, password, onLogin, authStatus }
  },

})
</script>
