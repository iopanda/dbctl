FROM node:lts

WORKDIR /usr/app
COPY . /usr/app

RUN npm install && \
    npm link -g
