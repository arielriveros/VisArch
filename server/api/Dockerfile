# Stage 1: Build
FROM node:current-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:current-alpine

WORKDIR /app

COPY --from=build /app/build .
COPY --from=build /app/package*.json ./
RUN mkdir -p /app/files

RUN npm install --only=production

EXPOSE 5000
CMD ["node", "server.js"]