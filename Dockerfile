FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache --virtual .gyp python3 make g++ gcc postgresql-dev \
    && npm i \
    && apk del .gyp

COPY tsconfig.json .eslintrc.json jest.config.ts ./

COPY src ./src

COPY tests ./tests

CMD ["npm", "start"]