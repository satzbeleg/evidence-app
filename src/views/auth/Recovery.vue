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

            <h3 class="title">{{ t('auth.recover_noun') }}</h3>
            <hr class="login-hr">
            <p class="subtitle">{{ t('auth.recover_cta') }}</p>

            <form @submit.prevent="onRecover" class="box form">

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
                <p class="control">
                  <button class="button is-rounded is-primary" type="submit">
                    <strong>{{ t('auth.recover') }}</strong>
                    <span class="icon"><i class="fas fa-trash-restore"></i></span>
                  </button>
                </p>
              </div>
        
            </form>

            <span style="display:flex;justify-content:space-between;">
              <router-link :to="{ path: '/auth/login' }">{{ t('auth.login') }}</router-link>
              <router-link :to="{ path: '/auth/signup' }">{{ t('auth.signup') }}</router-link>
            </span>

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
//import { useLoginAuth } from '@/functions/axios-evidence.js';


export default defineComponent({
  name: "Recovery",

  components: {
    TheNavbar
  },

  setup(){
    // multi-lingual support
    const { t, locale } = useI18n();

    watchEffect(() => {
      document.title = t('auth.login_noun');
    });

    // process submitted login request
    //const { login } = useLoginAuth(); 
    const email = ref("");

    // read URL query string
    const route = useRoute();

    const onRecover = async () => {
      try{
        //await login(username.value, password.value);
        router.push(route.query.redirect || '/');
      }catch(err){
        console.log(err);
      }
    }

    return { t, locale, email, onRecover }
  },

})
</script>
