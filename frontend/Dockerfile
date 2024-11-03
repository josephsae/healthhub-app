FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV NODE_OPTIONS=--openssl-legacy-provider
CMD ["npm", "start"]
