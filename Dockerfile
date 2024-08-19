FROM node:20 AS deps

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

FROM node:20 AS build

WORKDIR /app

COPY ./src ./src
COPY ./public ./public
COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./astro.config.mjs ./

COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
