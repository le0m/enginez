###
# Dependencies
###
FROM node:16-alpine as dependencies

WORKDIR /deps
COPY package.json package-lock.json /deps/
RUN npm install

###
# Builder
###
FROM node:16-alpine as builder

WORKDIR /build
COPY --from=dependencies /deps/node_modules/ /build/node_modules/
COPY build/ /build/build/
COPY package.json index.html .eslintrc.js /build/
COPY static/ /build/static/
COPY src/ /build/src/
RUN npm run build

###
# App
###
FROM nginx:stable-alpine

WORKDIR /app
COPY ./build/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist/ /usr/share/nginx/html/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
