# see https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

FROM nginx:stable-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 9090
