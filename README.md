[![Netlify Status](https://api.netlify.com/api/v1/badges/0d1cca68-8b41-4097-8eb2-52f6db306ba8/deploy-status)](https://app.netlify.com/sites/goofy-hypatia-8bd9ad/deploys)


# EVIDENCE App
UI for the EVIDENCE project (BBAW/TUD)

## Project setup

```bash
yarn install
yarn global add @vue/cli
```

Useful commands:

- Compiles and hot-reloads for development: `yarn serve`
- Compiles and minifies for production: `yarn build`
- Compile SASS: `yarn css-build`
- Lints and fixes files: `yarn lint`
- Open Vue.js UI: `vue ui`
- VS Code extension: [Vetur](https://github.com/vuejs/vetur)

Fixes:
- "Error: Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime": Run `npm rebuild node-sass`


## Benutzerkonten (Sign Up)
Benutzerkonten werden manuell von [Admin](mailto:hamster@bbaw.de) in der [SQL Datenbank](https://git.zdl.org/hamster/evidence-database) erstellt. 
Dies ist eine Zwischenlösung bis die [DWDS Auth API](https://git.zdl.org/knaebel/dwds-oauth2) in Betrieb geht (Ansprechpartner: Frank Wiegand und Rene Knaebel).
Daher wird auch kein Sign Up und PW-Wiederherstellung im Evidence Projekt implementiert.

Testkonten

- username: `test1` / password: `geheim1`  (Test User in REST API)
- username: `test2` / password: `geheim2`  (Test User in Datenbank)


## Login bei lokaler Entwicklung: CORS Error
Wenn REST API und Web App auf demselben Host laufen, dann wird es beim Login zu einem "CORS" Error kommen, z.B. 

```
Access to XMLHttpRequest at 'http://0.0.0.0:55017/v1/auth/login' 
from origin 'http://localhost:8080' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Um CORS zu deaktivieren installiere das Chrome Plugin ["Moesif CORS"](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc) oder das entsprechende [Firefox Plugin](https://addons.mozilla.org/en-US/firefox/addon/moesif-origin-cors-changer1/). Stelle im Plugin den Status auf **"off"**. 



## Used plugins
Vue.js
- Upgrade from Vue2 to Vue3: 
    - vue3: `yarn add vue-next` (Version 3.0.0)
- [Vue Router](https://router.vuejs.org/): 
    - vue2: `yarn add vue-router` 
    - vue3: https://github.com/vuejs/vue-router-next (Version 4.0.0)
- [Multi-Lang i18n support](https://kazupon.github.io/vue-i18n/): 
    - vue2: `yarn add vue-i18n`
    - vue3: https://github.com/intlify/vue-i18n-next (Version 9.0.0)
    - [messageformat](https://messageformat.github.io/messageformat/v3/): `yarn add messageformat` (handles pluralization and gender for i18n)
- PWA
    - Base functionality for PWA: `yarn add cli-plugin-pwa`
    - `yarn add register-service-worker` 

CSS

- Bulma
    - ~~[Buefy](https://buefy.org/documentation) for vue2: `yarn add buefy`~~
    - Bulma CSS for vue3: `yarn add bulma`
    - Bulma Ext., Switch Toggle: `yarn add bulma-switch`, see [here](https://wikiki.github.io/form/switch/)
    - Bulma Ext., Toast: `yarn add bulma-toast`, see [here](https://rfoel.github.io/bulma-toast/)
    - Bulma Ext., Sliders: `yarn add bulma-slider`, see [here](https://github.com/Wikiki/bulma-slider)
- Fontawesome 5:
    - ~~`yarn add @fortawesome/fontawesome-svg-core`~~
    - ~~`yarn add @fortawesome/free-solid-svg-icons`~~
    - ~~`yarn add @fortawesome/vue-fontawesome`, see [here](https://github.com/FortAwesome/vue-fontawesome#installation)~~
    - CSS for vue3: `yarn add @fortawesome/fontawesome-free`
- SASS/Themes
    - `yarn add node-sass --dev`
    - `yarn add sass-loader --dev`

Optimizations

- [Preload key requests](https://web.dev/uses-rel-preload): `yarn add @vue/preload-webpack-plugin`


Misc

- Data
    - Generate random UUIDs: `yarn add uuid`
- Cosmetic CSS stuff:
    - Fit text to a fixed-sized html element (`v-fit2box` directive): `yarn add vue-fit2box`



## Folders

```
.
+-- package.json
+-- .gitignore
+-- public
|   +-- index.html
|   +-- favicon.ico
|   +-- robots.txt
|   +-- img
|       +-- icons 
|           +-- ...
+-- src
    +-- App.vue
    +-- main.js
    +-- registerServiceWorker.js
    +-- router          (Route to a specific view/page)
    +-- views           (Single view/page; have app/database logic)
    +-- components      (Are doing 1 thing; Receive data from view/page)
    +-- functions       (Shared JS functions to call within "setup"; Replaces "mixins")
    +-- directives      (Directives plugins)
    +-- assets          (Media files used in components)
    +-- translations    (i18n locales)
```

Readings: 

- [How to Structure a Vue.js Project](https://itnext.io/how-to-structure-a-vue-js-project-29e4ddc1aeeb)


## Usage

### components/layout/LemmaSearch.vue
Suchmaske für Lemmata.

```vue
<template>
  ...
    <LemmaSearch v-bind:keywords="mylemmata" 
                 v-on:search-for-new-lemmata="triggerSearch" />
  ...
</template>

<script>
import LemmaSearch from "@/components/layout/LemmaSearch.vue";
import { ref } from "vue";
...
components: {
  LemmaSearch
},
...
setup(){
  const mylemmata = ref('Stichwort1, Mehr Worte')
  ...
  async function triggerSearch(keywords){
    console.log('Lemma Search clicked: ', keywords)
  }
  ...
  return { triggerSearch, mylemmata }
}
</script>
```


### components/layout/LanguageSwitcher.vue

```vue
<template>
  ...
  <LanguageSwitcher />
  ...
</template>

<script>
import LanguageSwitcher from "@/components/layout/LanguageSwitcher.vue";
...
components: {
  LanguageSwitcher
},
...
</script>
```