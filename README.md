# EVIDENCE App
UI for the EVIDENCE project (BBAW/TUD)



## Run the Web App in a docker container
The file `docker-compose.yml` contains an **configuration example** how to deploy the REST API as docker container. It is recommended to add this repository as git submodule to an deployment repository with a central Docker Compose configuration that suits your needs. 

```sh
# Host Server's Port Settings
export WEBAPP_HOSTPORT=55018

# Start containers
# - WARNING: Don't use the `docker compose` because it cannot process `ipv4_address`!
docker compose -p evidence -f network.yml -f webapp.yml up --build
```



## Run the Web App locally (Development Mode)

```sh
yarn install
```

```sh
yarn serve --port 55018
```

### .env.local

```
NODE_ENV=local
VUE_APP_REST_PUBLIC_URL=http://0.0.0.0:55017
VUE_APP_GOOGLE_CLIENT_ID=verylongsometing.apps.googleusercontent.com
```

Notes: Local variables specifiec in `.env.local` are not added to code (see [here](https://cli.vuejs.org/guide/mode-and-env.html#local-only-variables)). All variables needs to prefixed `VUE_APP_` to be available as `process.env.VUE_APP_...` JS variable in Vue. Never expose secret keys or passwords as Vue environment variable.


or for Docker

* `REST_PUBLIC_URL=http://evidence.bbaw.de:55017`
* `REST_PUBLIC_URL=https://evidence.bbaw.de`


### Useful commands
- Compiles and hot-reloads for development: `yarn serve`
- Compiles and minifies for production: `yarn build`
- Compile SASS: `yarn css-build`
- Update Icons: `yarn new-icons`
- Lints and fixes files: `yarn lint`
- Open Vue.js UI: `vue ui`
- VS Code extension: [Volar](https://github.com/johnsoncodehk/volar)

### Fixes
- "Error: Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime": Run `npm rebuild node-sass`
- node-gpy erors: Delete `rm -rf ~/.node-gyp`

### Login bei lokaler Entwicklung: CORS Error
Wenn REST API und Web App auf demselben Host laufen, dann wird es beim Login zu einem "CORS" Error kommen, z.B. 

```
Access to XMLHttpRequest at 'http://0.0.0.0:55017/v1/auth/login' 
from origin 'http://localhost:8080' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Um CORS zu deaktivieren installiere das Chrome Plugin ["Moesif CORS"](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc) oder das entsprechende [Firefox Plugin](https://addons.mozilla.org/en-US/firefox/addon/moesif-origin-cors-changer1/). Stelle im Plugin den Status auf **"off"**. 


## Tips & Tricks

### Force Cache Refresh
Bump the `pwa.assetVersion` value up in `./vue.config.js`.

### Changing the App Name
- `./vue.config.js`: `pwa.name` value
- `./public/index.html`: `<title>` tag

