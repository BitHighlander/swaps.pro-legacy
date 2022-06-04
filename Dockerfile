FROM node:16

ARG NPM_TOKEN
ARG NODE_ENV

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/

COPY . /usr/src/app

RUN npm install
RUN npm run build

ENV NODE_ENV docker

#start
CMD [ "npm", "run", "start-prod" ]