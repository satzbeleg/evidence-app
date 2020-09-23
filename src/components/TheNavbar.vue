<template>
  <!-- navigation/menu -->
  <!-- <b-navbar class="is-fixed-top is-spaced has-shadow"> -->
  <nav class="navbar is-fixed-top is-spaced has-shadow" role="navigation" aria-label="main navigation">

    <div class="navbar-brand">  <!-- <template v-slot:brand> -->
      <router-link class="navbar-item" :to="{ path: '/' }">  <!-- <b-navbar-item tag="router-link" :to="{ path: '/' }"> -->
        <img src="../assets/logo.png" alt="general app logo" />
      </router-link>  <!-- </b-navbar-item> -->

      <!-- language switcher -->
      <div class="navbar-item">  <!-- <b-navbar-item> -->
        <!-- <b-dropdown v-model="locale" aria-role="list"> -->
        <div class="dropdown is-hoverable">
          <div class="dropdown-trigger">
            <button class="button is-light" type="button" aria-haspopup="true" aria-controls="dropdown-menu">
              <span>
                <template v-if="locale == 'de'">Deutsch</template>
                <template v-if="locale == 'en-US'">English</template>
              </span>
              <span class="icon"><i class="fas fa-caret-down"></i></span>  <!-- <b-icon icon="caret-down"></b-icon> -->
            </button>
          </div>
        
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content" v-on:click="locale = $event.target.id">
              <a id="de" class="dropdown-item">Deutsch</a>   <!-- <b-dropdown-item aria-role="listitem" value="de">Deutsch</b-dropdown-item> -->
              <a id="en-US" class="dropdown-item">English</a>   <!-- <b-dropdown-item aria-role="listitem" value="en-US">English</b-dropdown-item> -->
            </div>
          </div>

        </div>  <!-- </b-dropdown> -->
      </div>  <!-- </b-navbar-item> -->

      <!-- <b-navbar-item>
        <DarkmodeIcon />
      </b-navbar-item> -->

      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="myNavbarMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>

    </div>  <!-- </template> -->

    <div id="myNavbarMenu" class="navbar-menu">
      <div class="navbar-start">   <!-- <template v-slot:start> -->

        <router-link class="navbar-item" :to="{ path: '/' }">  <!-- <b-navbar-item tag="router-link" :to="{ path: '/' }"> -->
          <span class="icon has-text-info"><i class="fas fa-home"></i></span>  <!-- <b-icon pack="fas" icon="home" style="color: red; align:left"></b-icon> -->
          <span>{{ t('header.home') }}</span>
        </router-link> <!-- </b-navbar-item> -->

        <router-link class="navbar-item" :to="{ path: '/' }">  <!-- <b-navbar-item tag="router-link" :to="{ path: '/about' }"> -->
          <span class="icon has-text-primary"><i class="fas fa-user"></i></span>  <!-- <b-icon pack="fas" icon="user" type="is-primary"></b-icon> -->
          <span>{{ t('header.about') }}</span>
        </router-link> <!-- </b-navbar-item> -->

        <router-link class="navbar-item" :to="{ path: '/' }">  <!-- <b-navbar-item tag="router-link" :to="{ path: '/settings' }"> -->
          <span class="icon has-text-dark"><i class="fas fa-cog"></i></span>  <!-- <b-icon pack="fas" icon="cog" type="is-primary"></b-icon> -->
          <span>{{ t('settings.settings') }}</span>
        </router-link> <!-- </b-navbar-item> -->


        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Satzbeispiele bewerten
          </a>

          <div class="navbar-dropdown">   <!-- <b-navbar-dropdown label="Satzbeispiele bewerten"> -->

            <router-link class="navbar-item" :to="{ path: '/' }">  <!-- <b-navbar-item tag="router-link" :to="{ path: '/bestworst3' }"> -->
              <div class="media">
                <span class="icon is-primary"><i class="fas fa-mobile-alt"></i></span>  <!-- <b-icon pack="fas" icon="mobile-alt" type="is-primary"></b-icon> -->
                <div class="media-content">
                  <strong>Best-Worst Ranking</strong>
                  <br />
                  <small>Wähle zuerst das beste Satzbeispiel und dann das schlechteste Beispiel aus.</small>
                </div>
              </div>
            </router-link>   <!-- </b-navbar-item> -->
            <hr class="navbar-divider is-hidden-widescreen" />

          </div>   <!-- </b-navbar-dropdown> -->
        </div>
      </div> <!-- </template> -->
    
    
      <div class="navbar-end">  <!-- <template v-slot:end> -->
        <div class="navbar-item">  <!-- <b-navbar-item tag="div"> -->
          <div class="field is-grouped is-grouped-multiline">

            <p class="control" v-if="!this.$store.getters['login/isAuthenticated']">
              <router-link :to="{ path: '/register' }">
                <a class="button is-info">
                  <strong>{{ t('auth.signup') }}</strong>
                  <span class="icon"><i class="fas fa-user-plus"></i></span>   <!-- <b-icon pack="fas" icon="user-plus"></b-icon> -->
                </a>
              </router-link>
            </p>

            <p class="control" v-if="!this.$store.getters['login/isAuthenticated']">
              <router-link :to="{ path: '/login' }">
                <a class="button is-primary">
                  <strong>{{ t('auth.login') }}</strong>
                  <span class="icon"><i class="fas fa-sign-in-alt"></i></span>  <!-- <b-icon pack="fas" icon="sign-in-alt"></b-icon> -->
                </a>
              </router-link>
            </p>

            <p class="control" v-if="this.$store.getters['login/isAuthenticated']">
              <a class="button is-danger" v-on:click="onLogout()">
                <strong>{{ t('auth.logout') }}</strong>
                <span class="icon"><i class="fas fa-sign-out-alt"></i></span>  <!-- <b-icon pack="fas" icon="sign-out-alt"></b-icon> -->
              </a>
            </p>
          </div>

        </div>

      </div>  <!-- </b-navbar-item> -->
    </div>  <!-- </template> -->

  </nav>  <!-- </b-navbar> -->
</template>


<script>
import '@/components/layout/navbar-toggle.js';
import { useI18n } from 'vue-i18n';
// import DarkmodeIcon from "@/components/DarkmodeIcon.vue";

export default {
  name: "TheNavbar",

  setup(){
    const { t, locale } = useI18n();
    return { t, locale }
  },

  // components: {
  //   DarkmodeIcon,
  // },

  methods: {
    onLogout() {
      this.$store.dispatch("login/authLogout").then(() => {
        this.$router.push("/login");
      });
    },
  },
};
</script>


<style>
/** Increase main sections's padding due to fixed bottom bar */
#app {padding-top: 0.75rem;}

@media screen and (min-width: 1024px){
  #app {padding-top: 3.5rem;}
}
</style>


<style scoped>
/** move icon to the right */
a.navbar-item > .icon:not(:last-child) {
  margin-left: -0.25em;
  margin-right: 0.25em;
}
/** Dropdown menu adjustments */
.navbar-dropdown .navbar-item {
  padding-left: 0.5rem;
  padding-right: 1.5rem;
}
.navbar-dropdown .navbar-item .icon {
  margin-left: -0.25em;
  margin-right: 0.25em;
}
</style>
