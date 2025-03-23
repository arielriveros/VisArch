FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]