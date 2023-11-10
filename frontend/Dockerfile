FROM node:latest


WORKDIR /app

COPY ./frontend/package.json ./package.json
COPY ./frontend/package-lock.json ./package-lock.json
COPY ./frontend/tsconfig.json ./tsconfig.json

RUN npm install -g npm
RUN npm install
