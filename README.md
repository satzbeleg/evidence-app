[![Netlify Status](https://api.netlify.com/api/v1/badges/0d1cca68-8b41-4097-8eb2-52f6db306ba8/deploy-status)](https://app.netlify.com/sites/goofy-hypatia-8bd9ad/deploys)


# EVIDENCE App
UI for the EVIDENCE project (BBAW/TUD)

## Project setup
```
yarn install
yarn global add @vue/cli
```

Useful commands:

- Compiles and hot-reloads for development: `yarn serve`
- Compiles and minifies for production: `yarn build`
- Lints and fixes files: `yarn lint`
- Open Vue.js UI: `vue ui`
- VS Code extension: [Vetur](https://github.com/vuejs/vetur)

## Used plugins
Vue.js
- Upgrade from Vue2 to Vue3: 
    - vue3: `yarn add vue-next` (Version 3.0.0)
- [Vue Router](https://router.vuejs.org/): 
    - vue2: `yarn add vue-router` 
    - vue3: https://github.com/vuejs/vue-router-next (Version 4.0.0)
- [Vuex State Management](https://vuex.vuejs.org/)
    - vue2: `yarn add vuex`
    - vue3: Install Version 4.0.0
    - Sync Vuex states with the browser's localForage API: `yarn add vuex-persist`
    - localForage (IndexedDB) instead of ~~LocalStorage~~: `yarn add localforage`
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
    +-- i18n.js
    +-- router          (Route to a specific view/page)
    +-- views           (Single view/page; have app/database logic)
    +-- components      (Are doing 1 thing; Receive data from view/page)
    +-- functions       (Shared JS functions to call within "setup"; Replaces "mixins")
    +-- directives      (Directives plugins)
    +-- assets          (Media files used in components)
    +-- translations    (i18n locales)
    +-- store           (Vuex state management, SSOT)
    +-- api             (abstractions for making API requests)
```

Readings: 

- [How to Structure a Vue.js Project](https://itnext.io/how-to-structure-a-vue-js-project-29e4ddc1aeeb)
- [Application Structure for Vuex](https://vuex.vuejs.org/guide/structure.html)

