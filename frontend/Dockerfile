FROM node:20 AS deps

WORKDIR ../app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

FROM nginx

WORKDIR /app

ENV NODE_VERSION=20.11.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN node --version
RUN npm --version

COPY ./src ./src
COPY ./public ./public
COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./astro.config.mjs ./

COPY --from=deps /app/node_modules ./node_modules

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

COPY ./docker/start.sh start.sh
RUN chmod +x start.sh
COPY ./docker/build.sh build.sh
RUN chmod +x build.sh
COPY ./docker/build-loop.sh build-loop.sh
RUN chmod +x build-loop.sh

RUN echo "healthy" >> /tmp/healthy

CMD ["./start.sh"]
