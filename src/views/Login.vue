<template>
  <section class="hero is-info is-fullheight-with-navbar" id="login">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">

          <h3 class="title">{{ $t('auth.login_noun') }}</h3>
          <hr class="login-hr">
          <p class="subtitle">{{ $t('auth.login_cta') }}</p>

          <form @submit.prevent="handleLogin" class="box form">

            <b-field v-bind:label="$t('auth.username')">
              <p class="control has-icons-left has-icons-right">
                <b-icon pack="fas" 
                        icon="user" 
                        class="is-small is-left"
                        ></b-icon>
                <b-input v-model="username"
                         type="text"
                         v-bind:placeholder="$t('auth.username_place')"
                         ></b-input>
              </p>
            </b-field>

            <b-field v-bind:label="$t('auth.password')">
              <p class="control has-icons-left has-icons-right">
                <b-icon pack="fas" 
                        icon="lock" 
                        class="is-small is-left"
                        ></b-icon>
                <b-input v-model="password" 
                         type="password"
                         v-bind:placeholder="$t('auth.password_place')"
                         ></b-input>
              </p>
            </b-field>
            
            <b-field>
              <p class="control">
                <b-checkbox v-model="remember">
                  {{ $t('auth.remember') }}
                </b-checkbox>
              </p>
            </b-field>

            <b-field>
              <p class="control">
                <button class="button is-primary" type="submit">
                  <strong>{{ $t('auth.login') }}</strong>
                  <b-icon pack="fas" icon="sign-in-alt"></b-icon>
                </button>
              </p>
            </b-field>
        
          </form>

        </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
export default {
  name: "Login",

  data(){
    return {
      username: "",
      password: "",
      remember: false
    };
  },

  methods: {
    handleLogin(){
      const { username, password } = this;
      this.$store.dispatch('login/authRequest', { username, password })
        .then(() => {
          this.$router.push('/')
        });
    }
  }
}
</script>
