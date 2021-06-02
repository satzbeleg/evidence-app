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

## .env.local

```
NODE_ENV=local
VUE_APP_API_URL=http://0.0.0.0:55017
```

Oder

* `VUE_APP_API_URL=http://riker.bbaw.de:55017`
* `VUE_APP_API_URL=https://riker.bbaw.de`

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
- vue3: `yarn add vue-next` (Version 3.0.0)
- [Vue Router](https://github.com/vuejs/vue-router-next) (Version 4.0.0)
- [Multi-Lang i18n support](https://github.com/intlify/vue-i18n-next) (Version 9.0.0)
- [messageformat](https://messageformat.github.io/messageformat/v3/): `yarn add messageformat` (handles pluralization and gender for i18n)
- Base functionality for PWA: `yarn add cli-plugin-pwa`, `yarn add register-service-worker` 
- Bulma CSS for vue3: `yarn add bulma`
- Bulma Ext., Switch Toggle: `yarn add bulma-switch`, see [here](https://wikiki.github.io/form/switch/)
- Bulma Ext., Toast: `yarn add bulma-toast`, see [here](https://rfoel.github.io/bulma-toast/)
- Bulma Ext., Sliders: `yarn add bulma-slider`, see [here](https://github.com/Wikiki/bulma-slider)
- Fontawesome 5: `yarn add @fortawesome/fontawesome-free`
- SASS/Themes: `yarn add node-sass --dev`, `yarn add sass-loader --dev`
- [Preload key requests](https://web.dev/uses-rel-preload): `yarn add @vue/preload-webpack-plugin`
- Generate random UUIDs: `yarn add uuid`
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
    +-- assets          (Media files used in components)
    +-- components      (Are doing 1 thing; Receive data from view/page)
    +-- directives      (Directives plugins)
    +-- functions       (Shared JS functions to call within "setup"; Replaces "mixins")
    +-- router          (Route to a specific view/page)
    +-- translations    (i18n locales)
    +-- views           (Single view/page; have app/database logic)
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

### functions/conn-toast.js
Verbindungsstatus erkennen (d.h. Online vs Offline) und eine Toast Benachrichtigung in der App anzeigen.

```vue
import useConnToast from '@/functions/conn-toast.js';
export default {
  setup(){
    useConnToast();
  }
}
```


## Run the Web APP in a docker container
The file `docker-compose.yml` contains an **configuration example** how to deploy the REST API as docker container. It is recommended to add this repository as git submodule to an deployment repository with a central Docker Compose configuration that suits your needs. 

```sh
# Host Server's Port Settings
export WEBAPP_HOST_PORT=55018

docker compose up --build
```
