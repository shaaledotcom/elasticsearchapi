FROM node:16-slim
WORKDIR /app
COPY package.json .
COPY tsconfig.json .
COPY placeholder.ts .
RUN npm install --omit=dev

COPY . ./

RUN npm run build

COPY src/keys ./build/src/keys/

COPY src/templates ./build/src/templates/

CMD npm run start
