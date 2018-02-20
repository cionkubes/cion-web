#!/usr/bin/env sh

yarn run build latest

docker --version

docker login --username=$DOCKER_USER --password=$DOCKER_PASS
docker push cion/web:${1:-latest}