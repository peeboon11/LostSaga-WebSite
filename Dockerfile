FROM node:alpine3.18

WORKDIR /app

COPY . .

RUN npm install

RUN npm install next

CMD ["npm", "run", "dev"]