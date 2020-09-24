<template>
  <!-- navigation/menu -->
  <nav class="navbar is-fixed-top is-spaced has-shadow" role="navigation" aria-label="main navigation">

    <div class="navbar-brand">
      <router-link class="navbar-item" :to="{ path: '/' }">
        <img src="../../assets/logo.png" alt="general app logo" />
      </router-link>

      <!-- language switcher -->
      <div class="navbar-item">
        <div class="dropdown" 
             v-on:click="showLangDrop = !showLangDrop" v-bind:class="{ 'is-active': showLangDrop }">
          <div class="dropdown-trigger" >
            <button class="button is-light" type="button" aria-haspopup="true" aria-controls="dropdown-menu">
              <span>
                <template v-if="locale == 'de'">Deutsch</template>
                <template v-if="locale == 'en-US'">English</template>
              </span>
              <span class="icon"><i class="fas fa-caret-down"></i></span>
            </button>
          </div>
        
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content" v-on:click="locale = $event.target.id">
              <a id="de" class="dropdown-item">Deutsch</a>
              <a id="en-US" class="dropdown-item">English</a>
            </div>
          </div>

        </div>
      </div>

      <div class="navbar-item">
        <DarkmodeIcon />
      </div>

      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="myNavbarMenu"
         v-on:click="showNavBurger = !showNavBurger" v-bind:class="{ 'is-active' : showNavBurger }">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>

    </div>


    <div id="myNavbarMenu" class="navbar-menu"
         v-on:click="showNavBurger = !showNavBurger" v-bind:class="{ 'is-active' : showNavBurger }">
      <div class="navbar-start">

        <router-link class="navbar-item" :to="{ path: '/' }">
          <span class="icon has-text-info"><i class="fas fa-home"></i></span>
          <span>{{ t('header.home') }}</span>
        </router-link>

        <router-link class="navbar-item" :to="{ path: '/about' }">
          <span class="icon has-text-primary"><i class="fas fa-user"></i></span>
          <span>{{ t('header.about') }}</span>
        </router-link>

        <router-link class="navbar-item" :to="{ path: '/settings' }">
          <span class="icon has-text-dark"><i class="fas fa-cog"></i></span>
          <span>{{ t('settings.settings') }}</span>
        </router-link>


        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Satzbeispiele bewerten
          </a>

          <div class="navbar-dropdown">

            <router-link class="navbar-item" :to="{ path: '/bestworst3' }">
              <div class="media">
                <span class="icon is-primary"><i class="fas fa-mobile-alt"></i></span>
                <div class="media-content">
                  <strong>Best-Worst Ranking</strong>
                  <br />
                  <small>Wähle zuerst das beste Satzbeispiel und dann das schlechteste Beispiel aus.</small>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider is-hidden-widescreen" />

          </div>
        </div>
      </div>
    
    
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped is-grouped-multiline">

            <p class="control" v-if="!this.$store.getters['login/isAuthenticated']">
              <router-link :to="{ path: '/register' }">
                <a class="button is-info">
                  <strong>{{ t('auth.signup') }}</strong>
                  <span class="icon"><i class="fas fa-user-plus"></i></span>
                </a>
              </router-link>
            </p>

            <p class="control" v-if="!this.$store.getters['login/isAuthenticated']">
              <router-link :to="{ path: '/login' }">
                <a class="button is-primary">
                  <strong>{{ t('auth.login') }}</strong>
                  <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                </a>
              </router-link>
            </p>

            <p class="control" v-if="this.$store.getters['login/isAuthenticated']">
              <a class="button is-danger" v-on:click="onLogout()">
                <strong>{{ t('auth.logout') }}</strong>
                <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
              </a>
            </p>
          </div>

        </div>

      </div>
    </div>

  </nav>
</template>


<script>
// import '@/components/layout/navbar-toggle.js';
import { useI18n } from 'vue-i18n';
import DarkmodeIcon from "@/components/settings/DarkmodeIcon.vue";
import { defineComponent, ref } from 'vue';


export default defineComponent({
  name: "TheNavbar",

  setup(){
    const showNavBurger = ref(false);
    const showLangDrop = ref(false)
    const { t, locale } = useI18n();
    return { t, locale, showNavBurger, showLangDrop }
  },

  components: {
    DarkmodeIcon,
  },

  methods: {
    onLogout() {
      this.$store.dispatch("login/authLogout").then(() => {
        this.$router.push("/login");
      });
    },
  },
});
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
