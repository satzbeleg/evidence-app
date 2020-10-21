<template>
  <section class="hero is-info is-fullheight-with-navbar" id="login">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">

          <h3 class="title">{{ t('auth.login_noun') }}</h3>
          <hr class="login-hr">
          <p class="subtitle">{{ t('auth.login_cta') }}</p>

          <form @submit.prevent="handleLogin" class="box form">

            <div class="field">
              <label class="label">{{ t('auth.username') }}</label>
              <p class="control has-icons-left has-icons-right">
                <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
                <input class="input" 
                       type="text"
                       v-model="username"
                       v-bind:placeholder="t('auth.username_place')">
              </p>
            </div>

            <div class="field">
              <label class="label">{{ t('auth.password') }}</label>
              <p class="control has-icons-left has-icons-right">
                <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
                <input class="input" 
                       type="password"
                       v-model="password" 
                       v-bind:placeholder="t('auth.password_place')">
              </p>
            </div>
            
            <!-- <div class="field">
              <p class="control">
                <label class="checkbox">
                  <input type="checkbox" v-model="remember">
                  {{ t('auth.remember') }}
                </label>
              </p>
            </div>  -->

            <div class="field">
              <p class="control">
                <button class="button is-primary" type="submit">
                  <strong>{{ t('auth.login') }}</strong>
                  <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                </button>
              </p>
            </div>
        
          </form>

        </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { useI18n } from 'vue-i18n';
import { watch } from "vue";


export default {
  name: "Login",

  setup(){
    const { t, locale } = useI18n();

    watch(() => {
      document.title = t('auth.login_noun');
    });

    return { t, locale }
  },

  data(){
    return {
      username: "",
      password: "",
      // remember: false
    };
  },

  methods: {
    handleLogin(){
      const { username, password } = this;
      this.$store.dispatch('auth/login/authRequest', { username, password })
        .then(() => {
          this.$router.push('/')
        });
    }
  }
}
</script>
