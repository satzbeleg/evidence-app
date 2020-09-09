[![Netlify Status](https://api.netlify.com/api/v1/badges/0d1cca68-8b41-4097-8eb2-52f6db306ba8/deploy-status)](https://app.netlify.com/sites/goofy-hypatia-8bd9ad/deploys)


# vue-app-template
My boilerplate Vue.js repo for PWA Apps.

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

Hints:

- VS Code extension: [Vetur](https://github.com/vuejs/vetur)

## Used plugins
General

- [vue-router](https://router.vuejs.org/): `yarn add vue-router` 
- [Buefy](https://buefy.org/documentation): `yarn add buefy`
- [vue-meta](https://github.com/nuxt/vue-meta): `yarn add vue-meta`
- [Multi-Lang i18n support](https://kazupon.github.io/vue-i18n/): `yarn add vue-i18n`
    - [messageformat](https://messageformat.github.io/messageformat/v3/): `yarn add messageformat` (handles pluralization and gender for i18n)
- [Fontawesome 5](https://github.com/FortAwesome/vue-fontawesome#installation):
    - `yarn add @fortawesome/fontawesome-svg-core`
    - `yarn add @fortawesome/free-solid-svg-icons`
    - `yarn add @fortawesome/vue-fontawesome`
- PWA
    - Base functionality for PWA: `yarn add cli-plugin-pwa`
- SASS/Themes
    - `yarn add node-sass --dev`
    - `yarn add sass-loader --dev`
- State Management, ~~LocalStorage~~ localForage (IndexedDB). All Vuex states of a session are synced with the browser's localForage API, and synced with an online REST API in the background.
    - `yarn add vuex`
    - `yarn add vuex-persist`
    - `yarn add localforage`
- Data
    - Generate random UUIDs: `yarn add uuid`
- Cosmetic CSS stuff:
    - Fit text to a fixed-sized html element (`v-fit2box` directive): `yarn add vue-fit2box`

Component development

- [swiped-events](https://github.com/john-doherty/swiped-events): `yarn add swiped-events` (small footprint JS code, just a div for swipe events)


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
    +-- mixins          (Shared JS code)
    +-- assets          (Media files used in components)
    +-- translations    (i18n locales)
    +-- store           (Vuex state management, SSOT)
    +-- api             (abstractions for making API requests)
```

Readings: 

- [How to Structure a Vue.js Project](https://itnext.io/how-to-structure-a-vue-js-project-29e4ddc1aeeb)
- [Application Structure for Vuex](https://vuex.vuejs.org/guide/structure.html)

