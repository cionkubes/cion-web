#!/usr/bin/env sh
set -e

docker --version

NODE_ENV=production webpack --progress --display-error-details --bail
docker build . --tag cion/web:latest

docker login --username=$DOCKER_USER --password=$DOCKER_PASS
docker push cion/web:${1:-latest}
docker logout