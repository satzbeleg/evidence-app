<template>
  <section class="hero has-background-warning is-fullheight-with-navbar" id="signup">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">

          <h3 class="title">{{ t('auth.signup_noun') }}</h3>
          <hr class="signup-hr">
          <p class="subtitle">{{ t('auth.signup_cta') }}</p>

          <form @submit.prevent="handleSignup" class="box form">

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
              <label class="label">{{ t('auth.email') }}</label>
              <p class="control has-icons-left has-icons-right">
                <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                <input class="input" 
                       type="email"
                       v-model="email"
                       v-bind:placeholder="t('auth.email')">
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

            <div class="field">
              <p class="control">
                <button class="button is-info" type="submit">
                  <strong>{{ t('auth.signup') }}</strong>
                  <span class="icon"><i class="fas fa-user-plus"></i></span>
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
import { watchEffect } from "vue";


export default {
  name: "Register",

  setup(){
    const { t, locale } = useI18n();

    watchEffect(() => {
      document.title = t('auth.signup_noun');
    });

    return { t, locale }
  },

  data(){
    return {
      email: "",
      username: "",
      password: ""
    };
  },

  methods: {
    handleSignup(){
      const { username, email, password } = this;
      this.$store.dispatch('auth/signup/authSignUp', { username, email, password })
        .then(() => {
          this.$router.push('/')
        });
    }
  }
}
</script>
