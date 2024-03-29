# EVIDENCE project - Web Application (Vue3)
Table of contents

- [Purpose](#purpose)
- [Installation](#installation)
- [Local Development](#local-development)
- [Customizations](#customizations)
- [Common Problems](#common-problems)
- [Appendix](#appendix)


## Purpose
The web application is programmed with Vue3 and provides user interfaces to conduct Best-Worst Scaling surveys about sentence examples, and search for good and diverse sets of sentence examples.
The Web App accesses the [databases](https://github.com/satzbeleg/evidence-database) via the [REST API](https://github.com/satzbeleg/evidence-restapi).

## Installation
Please follow the instruction of the [deployment repository](https://github.com/satzbeleg/evidence-deploy).


## Local Development
- [Start backend services](#start-backend-services)
- [Setup and start local web server](#setup-and-start-local-web-server)

### Start backend services

```bash
cd $EVIDENCE_DEPLOY 
docker-compose up --build dbauth dbeval mail api
```

### Add a test account
```sh
cd $EVIDENCE_DEPLOY 
cat restapi/test/addtestaccount.sql | docker exec -i evidence_dbauth psql -U evidence -d evidence
```

```
username : nobody@example.com
password : supersecret
```


### Setup and start local web server 
1) Install NPM modules

```sh
yarn install
```

2) Setup `.env`

```
NODE_ENV=local
VUE_APP_REST_PUBLIC_URL=http://localhost:7070
# NODE_ENV=production
# VUE_APP_REST_PUBLIC_URL=https://youractualdomain.org
VUE_APP_GOOGLE_CLIENT_ID=verylongsometing.apps.googleusercontent.com
```

Please look [here](https://cli.vuejs.org/guide/mode-and-env.html) for help about `.env`.
All variables needs to prefixed `VUE_APP_` to be available as `process.env.VUE_APP_...` JS variable in Vue. 
Never expose secret keys or passwords as Vue environment variable because they are exposed on client-side.

3) Start web server

```sh
# export NODE_OPTIONS=--openssl-legacy-provider
yarn serve --port 9090
```

Use Node v16 to avoid the "error:0308010C:digital envelope routines::unsupported" Error
```sh
nvm install 16
``` 

### Useful commands
- Compile SASS: `yarn css-build`
- Update Icons: `yarn new-icons`
- Compiles and hot-reloads for development: `yarn serve`
- Compiles and minifies for production: `yarn build`
- Lints and fixes files: `yarn lint`
- Open Vue.js UI: `vue ui`


## Customizations
The source code contains files that are specific to the project AUTHORS needs, 
and must be customized to your needs if you decide to deploy this software.

- `./src/translations/pages/*` contains content pages for the a) informed consents, b) privacy policy, c) terms of usage, etc. You need to tailor the content to yourself.



## Common Problems

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
You are asked to sign the CLA on your first pull request.


### Syntax
We are using 
- `snake_case`: variable names 
- `kebab-case`: JSON keys
- `camelCase`: function names, class names
