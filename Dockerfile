FROM node:16

ARG NPM_TOKEN
ARG NODE_ENV

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils libusb-1.0-0-dev libudev-dev
RUN apt-get install -y --no-install-recommends apt-utils

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/

COPY . /usr/src/app

RUN npm install --force --max-old-space-size=16144
#RUN npm run build --max-old-space-size=16144

ENV NODE_ENV docker

#start
CMD [ "npm", "run", "start-prod" ]
