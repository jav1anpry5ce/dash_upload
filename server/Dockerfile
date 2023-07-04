FROM node:alpine

WORKDIR /server

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

ENV PORT=9000

EXPOSE 9000

CMD [ "npm", "start" ]