#!/bin/bash

VERSION_FRONTEND=$(cat ./frontend/package.json | jq -r '.version')
VERSION_BACKEND=$(cat ./backend/package.json | jq -r '.version')

docker build --platform=linux/amd64 -t brusckvallen-frontend ./frontend
docker build --platform=linux/amd64 -t brusckvallen-backend ./backend

docker tag brusckvallen-frontend "pumpedsardines/brusckvallen-frontend:$VERSION_FRONTEND"
docker tag brusckvallen-frontend "pumpedsardines/brusckvallen-frontend:latest"
docker tag brusckvallen-backend "pumpedsardines/brusckvallen-backend:$VERSION_BACKEND"
docker tag brusckvallen-backend "pumpedsardines/brusckvallen-backend:latest"

docker push "pumpedsardines/brusckvallen-frontend:$VERSION_FRONTEND"
docker push "pumpedsardines/brusckvallen-frontend:latest"
docker push "pumpedsardines/brusckvallen-backend:$VERSION_BACKEND"
docker push "pumpedsardines/brusckvallen-backend:latest"
