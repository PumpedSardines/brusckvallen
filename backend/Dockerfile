FROM node:20 AS deps

WORKDIR ../app

COPY ./prisma ./prisma
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci
RUN npm run prisma:generate

FROM node:20 AS build

WORKDIR /app

COPY ./src ./src
COPY ./package.json ./
COPY ./tsconfig.json ./

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

FROM node:20 

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY ./package.json ./

CMD npm run start:prod
