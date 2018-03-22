#!/usr/bin/env sh
set -e

docker --version
IMAGE=$(docker build . --quiet)

docker login --username=$DOCKER_USER --password=$DOCKER_PASS

for tag in $@; do
    docker image tag $IMAGE cion/web:$tag
    docker push cion/web:$tag
done

docker logout