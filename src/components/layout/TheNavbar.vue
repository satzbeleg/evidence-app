<template>
  <!-- navigation/menu -->
  <nav class="navbar is-fixed-top is-spaced has-shadow" role="navigation" aria-label="main navigation">

    <div class="navbar-brand">
      <router-link class="navbar-item" :to="{ path: '/' }">
        <img src="../../assets/logo.png" alt="general app logo" />
      </router-link>


      <div class="navbar-item" v-if="with_lemmata_search">
        <LemmaSearch v-bind:initial_keywords="lemma_keywords" 
                     v-on:search-lemmata-field="onSearchLemmata" />
      </div>

      <div class="navbar-item" v-if="with_lang_switch">
        <LanguageSwitcher />
      </div>

      <div class="navbar-item" v-if="with_darkmode_icon">
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

        <!-- DISABLE HOME ICON
        <router-link class="navbar-item" :to="{ path: '/' }">
          <span class="icon has-text-primary"><i class="fas fa-home"></i></span>
          <span>{{ t('header.home') }}</span>
        </router-link>
        -->
        <router-link class="navbar-item" :to="{ path: '/' }">
          <span class="icon has-text-success"><i class="fas fa-play"></i></span>
          <span>Start</span>
        </router-link>

        <router-link class="navbar-item" :to="{ path: '/about' }">
          <span class="icon has-text-info"><i class="fas fa-user"></i></span>
          <span>{{ t('header.about') }}</span>
        </router-link>

        <router-link class="navbar-item" :to="{ path: '/settings' }">
          <span class="icon has-text-dark"><i class="fas fa-cog"></i></span>
          <span>{{ t('settings.settings') }}</span>
        </router-link>


        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            {{ t('menu.evaluate') }}
          </a>

          <div class="navbar-dropdown">

            <router-link class="navbar-item" :to="{ path: '/bestworst3' }">
              <div class="media">
                <span class="icon is-primary"><i class="fas fa-random"></i></span>
                <div class="media-content">
                  <strong>{{ t('menu.bestworst3') }}</strong>
                  <br />
                  <small>{{ t('menu.bestworst3_text') }}</small>
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

            <p class="control" v-if="!isAuthenticated">
              <router-link :to="{ path: '/login' }">
                <a class="button is-primary">
                  <strong>{{ t('auth.login') }}</strong>
                  <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                </a>
              </router-link>
            </p>

            <p class="control" v-if="isAuthenticated">
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
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";
import DarkmodeIcon from "@/components/layout/DarkmodeIcon.vue";
import LemmaSearch from "@/components/layout/LemmaSearch.vue";
import { defineComponent, ref } from 'vue';
import router from '@/router';
import { useLoginAuth } from '@/functions/axios-evidence.js';


export default defineComponent({
  name: "TheNavbar",

  components: {
    LemmaSearch,
    LanguageSwitcher,
    DarkmodeIcon
  },

  props: {
    with_lemmata_search: {
      type: Boolean,
      default: false
    },
    lemma_keywords: {
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
    'search-lemmata-navbar'
  ],

  setup(props, {emit}){
    // multi-lingual support
    const { t, locale } = useI18n();

    // reactive variables for navbar
    const showNavBurger = ref(false);
    // const showLangDrop = ref(false);

    // Logout Button
    const { logout, isAuthenticated } = useLoginAuth();
    const onLogout = async () => {
      try{
        await logout();
        router.push("/login");
      }catch(err){
        console.log(err);
      }
    }

    // forward search field string to parent component
    const onSearchLemmata = async(keywords) => {
      //console.log('NavBar:', keywords)
      emit('search-lemmata-navbar', keywords)
    }

    return { 
      t, locale, 
      showNavBurger, onSearchLemmata,
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
