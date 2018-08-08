FROM node:latest

WORKDIR /app

EXPOSE 80

CMD npm i ; npm start
