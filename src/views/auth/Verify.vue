<template>
  <TheNavbar v-bind:with_lang_switch="true"
             v-bind:with_darkmode_icon="true"
             v-bind:with_lemmata_search="false" />

  <section id="verify" class="hero is-fullheight-with-navbar" 
           :class="{ 'is-info': status=='waiting', 'is-success': status=='success', 'is-danger': status=='failed' }">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen has-text-centered">

            <div v-if="error" class="error">{{ error.message }}</div>

            <h3 class="title">{{ t('auth.verify_noun') }}</h3>
            <hr class="login-hr">

            <template v-if="status == 'waiting'">
            <p class="subtitle">Push the button to verify your E-Mail.</p>
            <form @submit.prevent="pushVerifyButton($route.params.verifyToken)" class="form">
              <div class="field">
                <p class="control">
                  <button class="button is-rounded is-primary" type="submit">
                    <strong>{{ t('auth.verify') }}</strong>
                    <span class="icon"><i class="fas fa-check-circle"></i></span>
                  </button>
                </p>
              </div>        
            </form>
            </template>

            <template v-if="status == 'success'">
              <p class="subtitle">
                Verification was successful.<br>
                Proceed to the <router-link :to="{ path: '/auth/login' }"><u>Login page</u></router-link>.
              </p>
            </template>

            <template v-if="status == 'failed'">
              <p class="subtitle">
                Verification failed.<br>
                Try to <router-link :to="{ path: '/auth/signup' }"><u>Sign Up</u></router-link> again.
              </p>
            </template>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import { useI18n } from 'vue-i18n';
import { ref, defineComponent, watchEffect } from "vue";
import { useAuth } from '@/functions/axios-evidence.js';


export default defineComponent({
  name: "Verify",

  components: {
    TheNavbar
  },

  setup(){
    // multi-lingual support
    const { t, locale } = useI18n();

    watchEffect(() => {
      document.title = t('auth.verify_noun');
    });

    const { verifyEmail } = useAuth(); 
    const status = ref("waiting");

    const pushVerifyButton = async (verifyToken) => {
      try{
        await verifyEmail(verifyToken);
        status.value = "success"
      }catch{
        status.value = "failed"
      }
    }

    return { t, locale, status, pushVerifyButton }
  },

})
</script>
