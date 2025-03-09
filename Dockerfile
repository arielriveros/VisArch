# CLIENT BUILD STAGE
FROM node:current-alpine AS build-stage
WORKDIR /app
COPY client/package*.json /app
RUN npm ci
COPY ./client /app
RUN npm run build

# SERVER BUILD STAGE
FROM node:current-alpine
WORKDIR /app
COPY server/package*.json .
RUN npm ci
COPY ./server /app
EXPOSE 5000

RUN mkdir files

COPY --from=build-stage /app/build /app/static

CMD ["node", "server.js"]