# EVIDENCE project - Web Application (Vue3)
Table of contents

- [Purpose](#purpose)
- [Installation](#installation)
- [Local Development](#local-development)
- [Common Problems](#common-problems)
- [Appendix](#appendix)


## Purpose
The web application is programmed with Vue3 and provides user interfaces to conduct Best-Worst Scaling surveys about sentence examples, and search for good and diverse sets of sentence examples.
The Web App accesses the [databases](https://github.com/satzbeleg/evidence-database) via the [REST API](https://github.com/satzbeleg/evidence-restapi).

## Installation
Please follow the instruction of the [deployment repository](https://github.com/satzbeleg/evidence-deploy).


## Local Development
- [Setup and start local web server](#setup-and-start-local-web-server)
- [Check if the docker configuration of the REST API works](#check-if-the-docker-configuration-of-the-rest-api-works)

### Setup and start local web server 
1) Install NPM modules

```sh
yarn install
```

2) Setup `.env.local`

```
NODE_ENV=local
VUE_APP_REST_PUBLIC_URL=http://0.0.0.0:55017
VUE_APP_GOOGLE_CLIENT_ID=verylongsometing.apps.googleusercontent.com
```

Notes: Local variables specifiec in `.env.local` are not added to code (see [here](https://cli.vuejs.org/guide/mode-and-env.html#local-only-variables)). All variables needs to prefixed `VUE_APP_` to be available as `process.env.VUE_APP_...` JS variable in Vue. Never expose secret keys or passwords as Vue environment variable.

3) Start web server

```sh
yarn serve --port 55018
```


### Check if the docker configuration of the REST API works

```sh
# Host Server's Port Settings
export WEBAPP_HOSTPORT=55018
export REST_PUBLIC_URL=http://yourdomain:55017

# Start containers
# - WARNING: Don't use the `docker compose` because it cannot process `ipv4_address`!
docker compose -p evidence -f network.yml -f webapp.yml up --build
```


### Useful commands
- Compile SASS: `yarn css-build`
- Update Icons: `yarn new-icons`
- Compiles and hot-reloads for development: `yarn serve`
- Compiles and minifies for production: `yarn build`
- Lints and fixes files: `yarn lint`
- Open Vue.js UI: `vue ui`



## Common Problems

### CORS Error: REST API
If the REST API and the web app are running on the same host, a "CORS" error will occur when logging in, e.g.

```
Access to XMLHttpRequest at 'http://0.0.0.0:55017/v1/auth/login' 
from origin 'http://localhost:8080' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

The Chrome Plugin ["Moesif CORS"](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc) or the corresponding [Firefox Plugin](https://addons.mozilla.org/en-US/firefox/addon/moesif-origin-cors-changer1/) can disable the CORS error (i.e. **"off"**). 


### CORS Error: Setup GCP bucket for TFJS models
```sh
echo '[{"origin": ["*"],"responseHeader": ["Content-Type"],"method": ["GET", "HEAD"],"maxAgeSeconds": 3600}]' > cors-config.json
gsutil cors set cors-config.json gs://tfjs-models-1
```


### Force Cache Refresh
Bump the `pwa.assetVersion` value up in `./vue.config.js`.


### Changing the App Name
You need to change the following files:

- `./vue.config.js`: `pwa.name` value
- `./public/index.html`: `<title>` tag


### Other
- "Error: Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime": Run `npm rebuild node-sass`
- node-gpy errors: Delete `rm -rf ~/.node-gyp`


## Appendix

### Support
Please [open an issue](https://github.com/satzbeleg/evidence-app/issues/new) for support.

### Contributing
Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/satzbeleg/evidence-app/compare/).

