# FROM nginx:latest
FROM node:latest

WORKDIR /app

COPY ./backend/package.json ./package.json
COPY ./backend/package-lock.json ./package-lock.json

RUN yes | npm install -g npm
RUN yes | npm install

COPY ./backend ./

CMD ["node", "index.js"]