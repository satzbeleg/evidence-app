<template>
  <div class="dropdown"
       v-on:click="showLangDrop = !showLangDrop"
       v-bind:class="{ 'is-active': showLangDrop }">
    <div class="dropdown-trigger">
      <button class="button is-rounded is-light" type="button"
              aria-haspopup="true" aria-controls="dropdown-menu">
        <span>
          <template v-if="language == 'de'">Deutsch</template>
          <template v-if="language == 'de-leicht'">Leichte Sprache</template>
          <template v-if="language == 'en'">English</template>
          <template v-if="language == 'fr'">Français</template>
        </span>
        <span class="icon"><i class="fas fa-caret-down"></i></span>
      </button>
    </div>

    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content" v-on:click="language = $event.target.id">
        <a id="de" class="dropdown-item">Deutsch</a>
        <a id="de-leicht" class="dropdown-item">Leichte Sprache</a>
        <a id="en" class="dropdown-item">English</a>
        <a id="fr" class="dropdown-item">Français</a>
      </div>
    </div>
  </div>
</template>


<script>
import { defineComponent, ref } from "vue";
import { useI18n } from 'vue-i18n';
import { useGeneralSettings } from '@/components/settings/general-settings.js';


export default defineComponent({
  name: "LanguageSwitcher",

  setup(){
    // multi-lingual support
    const { t } = useI18n();
    const { language, loadGeneralSettings } = useGeneralSettings();
    loadGeneralSettings();
  
    // reactive variables to toggle menu
    const showLangDrop = ref(false);

    return { t, language, showLangDrop }
  }
});
</script>