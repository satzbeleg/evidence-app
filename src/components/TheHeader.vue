<template>
  <header class="header">
    <!-- navigation/menu -->
    <b-navbar class="is-spaced has-shadow">
      
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="../assets/logo.png"
               alt="general app logo">
        </b-navbar-item>

        <!-- language switcher -->
        <!-- {{ $i18n.locale }} -->
        <b-navbar-item>
          <b-dropdown v-model="$i18n.locale" aria-role="list">

            <button class="button is-light" type="button" slot="trigger">
              <template v-if="$i18n.locale == 'de'"><span>Deutsch</span></template>
              <template v-if="$i18n.locale == 'en-US'"><span>English</span></template>
              <b-icon icon="caret-down"></b-icon>
            </button>

            <b-dropdown-item aria-role="listitem" value="de">Deutsch</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" value="en-US">English</b-dropdown-item>
            
          </b-dropdown>
        </b-navbar-item>

        <b-navbar-item>
          <DarkmodeIcon />
        </b-navbar-item>

      </template>

      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <b-icon pack="fas" icon="home" style="color: red; align:left"></b-icon>
          <span>{{ $t('header.home') }}</span>
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/about' }">
          <b-icon pack="fas" icon="user" type="is-primary"></b-icon>
          <span>{{ $t('header.about') }}</span>
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/settings' }">
          <b-icon pack="fas" icon="cog" type="is-primary"></b-icon>
          <span>{{ $t('settings.settings') }}</span>
        </b-navbar-item>

        <b-navbar-dropdown label="Swipe Demos">

          <b-navbar-item tag="router-link" :to="{ path: '/swipe1' }">
            <div class="media">
              <b-icon pack="fas" icon="mobile-alt" type="is-primary"></b-icon>
              <div class="media-content">
                <strong>Tinder-like swipe</strong><br>
                <small>Left/Right/Up swipe directions</small>
              </div>
            </div>
          </b-navbar-item>
          <hr class="navbar-divider is-hidden-widescreen">

          <b-navbar-item tag="router-link" :to="{ path: '/swipe2' }">
            <div class="media">
              <b-icon pack="fas" icon="mobile-alt" type="is-primary"></b-icon>
              <div class="media-content">
                <strong>Binary Labelling</strong><br>
                <small>Swipe a card left/right</small>
              </div>
            </div>
          </b-navbar-item>
          <hr class="navbar-divider is-hidden-widescreen">

        </b-navbar-dropdown>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="field is-grouped is-grouped-multiline">

            <p class="control" v-if="!this.$store.getters['login/isAuthenticated']">
              <router-link :to="{ path: '/register' }">
                <a class="button is-info">
                  <strong>{{ $t('auth.signup') }}</strong>
                  <b-icon pack="fas" icon="user-plus"></b-icon>
                </a>
              </router-link>
            </p>

            <p class="control" v-if="!this.$store.getters['login/isAuthenticated']">
              <router-link :to="{ path: '/login' }">
                <a class="button is-primary">
                  <strong>{{ $t('auth.login') }}</strong>
                  <b-icon pack="fas" icon="sign-in-alt"></b-icon>
                </a>
              </router-link>
            </p>

            <p class="control" v-if="this.$store.getters['login/isAuthenticated']">
              <a class="button is-danger" v-on:click="onLogout()">
                <strong>{{ $t('auth.logout') }}</strong>
                <b-icon pack="fas" icon="sign-out-alt"></b-icon>
              </a>
            </p>

          </div>
        </b-navbar-item>
      </template>

    </b-navbar>
  </header>
</template>


<script>
import DarkmodeIcon from '@/components/DarkmodeIcon.vue';

export default {
  name: "Header",

  components: {
    DarkmodeIcon
  },

  methods: {
    onLogout(){
      this.$store.dispatch('login/authLogout')
        .then(() => {
          this.$router.push('/login')
        });
    }
  }
}
</script>


<style scoped>
/** move icon to the right */
a.navbar-item>.icon:not(:last-child) {
    margin-left: -.25em;
    margin-right: .25em;
}
/** Dropdown menu adjustments */
.navbar-dropdown .navbar-item {
    padding-left: .5rem;
    padding-right: 1.5rem;
}
.navbar-dropdown .navbar-item .icon {
    margin-left: -.25em;
    margin-right: .25em;
}
</style>
