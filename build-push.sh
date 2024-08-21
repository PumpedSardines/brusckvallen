#!/bin/bash

VERSION_FRONTEND=$(cat ./frontend/package.json | jq -r '.version')

docker build --platform=linux/amd64 -t brusckvallen-frontend ./frontend

docker tag brusckvallen-frontend "pumpedsardines/brusckvallen-frontend:$VERSION_FRONTEND"
docker tag brusckvallen-frontend "pumpedsardines/brusckvallen-frontend:latest"

docker push "pumpedsardines/brusckvallen-frontend:$VERSION_FRONTEND"
docker push "pumpedsardines/brusckvallen-frontend:latest"
