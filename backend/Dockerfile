FROM node:21-alpine as build-image
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY server.ts server.ts
COPY ./types ./types
RUN npm ci
RUN npx tsc

FROM node:21-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build-image ./usr/src/app/dist ./dist
RUN npm ci --production
COPY . .
EXPOSE 3001
CMD [ "node", "dist/server.js" ]
