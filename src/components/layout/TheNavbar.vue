<template>
  <!-- navigation/menu -->
  <nav class="navbar is-fixed-top is-spaced has-shadow" role="navigation" aria-label="main navigation">

    <div class="navbar-brand">
      <router-link class="navbar-item is-hidden-mobile" :to="{ path: '/' }">
        <img src="../../assets/logo.png" alt="general app logo" />
      </router-link>


      <div class="navbar-item" v-if="with_headword_search">
        <HeadwordSearch 
          v-bind:initial_headword="search_string" 
          v-on:search-headword-field="onSearchHeadword" />
      </div>

      <div class="navbar-item" v-if="with_lang_switch">
        <LanguageSwitcher />
      </div>

      <div class="navbar-item" v-if="with_darkmode_icon">
        <DarkmodeIcon />
      </div>


      <a role="button" class="navbar-burger burger" 
          aria-label="menu" aria-expanded="false" data-target="myNavbarMenu"
          v-on:click="showNavBurger = !showNavBurger" 
          v-bind:class="{ 'is-active' : showNavBurger }">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>

    </div>


    <div id="myNavbarMenu" class="navbar-menu"
         v-on:click="showNavBurger = !showNavBurger" 
         v-bind:class="{ 'is-active' : showNavBurger }">
      <div class="navbar-start">

        <router-link class="navbar-item" :to="{ path: '/bestworst4' }">
          <span class="icon has-text-success"><i class="fas fa-play"></i></span>
          <span>Start</span>
        </router-link>

        <router-link class="navbar-item" :to="{ path: '/settings' }">
          <span class="icon has-text-dark"><i class="fas fa-cog"></i></span>
          <span>{{ t('settings.settings') }}</span>
        </router-link>


        <!-- start submenu -->
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            {{ t('menu.evaluate') }}
          </a>

          <div class="navbar-dropdown">

            <router-link class="navbar-item" :to="{ path: '/bestworst3' }">
              <div class="media">
                <span class="icon is-primary"><i class="fas fa-random"></i></span>
                <div class="media-content">
                  <strong>Best-Worst Scaling</strong>
                  <br />
                  <small>Best-Worst Scaling UI v3</small>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider is-hidden-widescreen" />

            <router-link class="navbar-item" :to="{ path: '/bestworst4' }">
              <div class="media">
                <span class="icon has-text-success"><i class="fas fa-undo-alt"></i></span>
                <div class="media-content">
                  <strong>Interactive Best-Worst Scaling</strong>
                  <br />
                  <small>Best-Worst Scaling UI v4</small>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider is-hidden-widescreen" />

          </div>
        </div>
        <!-- end submenu -->

        <!-- start submenu -->
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            <span>{{ t('header.about') }}</span>
          </a>

          <div class="navbar-dropdown">

            <router-link class="navbar-item" :to="{ path: '/info/about' }">
              <div class="media">
                <span class="icon has-text-info"><i class="fas fa-university"></i></span>
                <div class="media-content">
                  <strong>{{ t('about.title') }}</strong>
                  <br />
                  <small>{{ t('about.menu_description') }}</small>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider is-hidden-widescreen" />

            <router-link class="navbar-item" :to="{ path: '/info/tips' }">
              <div class="media">
                <span class="icon has-text-warning"><i class="fas fa-question-circle"></i></span>
                <div class="media-content">
                  <strong>{{ t('tips.title') }}</strong>
                  <br />
                  <small>{{ t('tips.menu_description') }}</small>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider is-hidden-widescreen" />

            <router-link class="navbar-item" :to="{ path: '/legal/privacy' }">
              <div class="media">
                <span class="icon"><i class="fas fa-user-secret"></i></span>
                <div class="media-content">
                  <strong>{{ t('privacy.title') }}</strong>
                  <br />
                  <small>{{ t('privacy.menu_description') }}</small>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider is-hidden-widescreen" />

            <router-link class="navbar-item" :to="{ path: '/legal/consent' }">
              <div class="media">
                <span class="icon"><i class="fas fa-handshake"></i></span>
                <div class="media-content">
                  <strong>{{ t('consent.title') }}</strong>
                  <br />
                  <small>{{ t('consent.menu_description') }}</small>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider is-hidden-widescreen" />

            <router-link class="navbar-item" :to="{ path: '/legal/terms' }">
              <div class="media">
                <span class="icon"><i class="fas fa-balance-scale"></i></span>
                <div class="media-content">
                  <strong>{{ t('terms.title') }}</strong>
                  <br />
                  <small>{{ t('terms.menu_description') }}</small>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider is-hidden-widescreen" />

            <router-link class="navbar-item" :to="{ path: '/legal/imprint' }">
              <div class="media">
                <span class="icon"><i class="fas fa-stamp"></i></span>
                <div class="media-content">
                  <strong>{{ t('imprint.title') }}</strong>
                  <br />
                  <small>{{ t('imprint.menu_description') }}</small>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider is-hidden-widescreen" />

          </div>
        </div>
        <!-- end submenu -->

      </div>
    
    
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped is-grouped-multiline">

            <p class="control" v-if="!isAuthenticated">
              <router-link :to="{ path: '/auth/signup' }">
                <a class="button is-rounded is-info">
                  <strong>{{ t('auth.signup') }}</strong>
                  <span class="icon"><i class="fas fa-user-plus"></i></span>
                </a>
              </router-link>
            </p>

            <p class="control" v-if="!isAuthenticated">
              <router-link :to="{ path: '/auth/login' }">
                <a class="button is-rounded is-primary">
                  <strong>{{ t('auth.login') }}</strong>
                  <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                </a>
              </router-link>
            </p>

            <p class="control" v-if="isAuthenticated">
              <a class="button is-rounded is-danger" v-on:click="onLogout()">
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
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";
import DarkmodeIcon from "@/components/layout/DarkmodeIcon.vue";
import HeadwordSearch from "@/components/layout/HeadwordSearch.vue";
import { defineComponent, ref } from 'vue';
import router from '@/router';
import { useAuth } from '@/functions/axios-evidence.js';


export default defineComponent({
  name: "TheNavbar",

  components: {
    HeadwordSearch,
    LanguageSwitcher,
    DarkmodeIcon
  },

  props: {
    with_headword_search: {
      type: Boolean,
      default: false
    },
    search_string: {
      type: String,
      default: undefined
    },
    with_lang_switch: {
      type: Boolean,
      default: false
    },
    with_darkmode_icon: {
      type: Boolean,
      default: false
    }
  },

  emits: [
    'search-headword-navbar'
  ],

  setup(props, {emit}){
    // multi-lingual support
    const { t, locale } = useI18n();

    // reactive variables for navbar
    const showNavBurger = ref(false);

    // Logout Button
    const { logout, isAuthenticated } = useAuth();
    const onLogout = async () => {
      try{
        await logout();
        router.push("/auth/login");
      }catch(err){
        console.log(err);
      }
    }

    // forward search field string to parent component
    const onSearchHeadword = async(keywords) => {
      //console.log('NavBar:', keywords)
      emit('search-headword-navbar', keywords)
    }

    return { 
      t, locale, 
      showNavBurger, onSearchHeadword,
      onLogout, isAuthenticated
    }
  }

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
