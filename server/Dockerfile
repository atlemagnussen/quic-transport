# syntax = docker/dockerfile:1.2
FROM node:16-bullseye

ARG ENV

RUN apt-get update -y && apt-get upgrade -y 
RUN apt-get install -y clang-11 cmake build-essential
RUN apt-get install -y perl6 golang ninja-build protobuf-compiler

WORKDIR /app
COPY src/server.js ./
COPY src/testsuite.js ./
COPY src/cert/. ./cert/

WORKDIR /app/cert
RUN ./generate_certs.sh
RUN ./generate_certs_leaf.sh
WORKDIR /app

COPY package*.json ./

#COPY . .

RUN npm install cmake-js --location=global
RUN npm install

#debug
#RUN --mount=type=secret,id=GH_TOKEN export GH_TOKEN=`cat /run/secrets/GH_TOKEN`; if [ "$ENV" = "debug" ] ; then npm install ; else  npm ci --only=production; fi

EXPOSE 8080/udp

CMD [ "node", "server.js" ]