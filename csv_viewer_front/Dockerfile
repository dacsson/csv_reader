FROM node:14.16.1

WORKDIR /app

COPY package.json ./ 

RUN npm install

COPY . .

EXPOSE 8085

CMD ["npm", "start"]