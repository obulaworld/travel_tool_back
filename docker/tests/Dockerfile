FROM node:carbon

LABEL MAINTAINER="Harith Javed <harith.bakhrani@andela.com>"
LABEL application="travela-backend"

ENV TERM=xterm-256color

WORKDIR /usr/app

COPY package.json /usr/app
COPY yarn.lock /usr/app
RUN yarn install

COPY src /usr/app/src
COPY .sequelizerc /usr/app
COPY .eslintrc /usr/app
COPY .babelrc /usr/app

COPY docker/tests/entrypoint.sh /usr/app
