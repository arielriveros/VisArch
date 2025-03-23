FROM node:14 AS build

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY package.json ./ 
COPY package-lock.json ./ 
# COPY nginx.conf ./
RUN npm install

COPY . ./ 
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
# COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]