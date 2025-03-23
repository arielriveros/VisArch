FROM node:14 AS build

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY package.json ./ 
COPY package-lock.json ./ 
RUN npm install

COPY . ./ 
RUN if [ "$NODE_ENV" = "production" ]; then npm run build:production; else npm run build:development; fi

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]