#!/usr/bin/env sh
set -e

docker --version
ls -R lib
IMAGE=$(docker build . --quiet)

docker login --username=$DOCKER_USER --password=$DOCKER_PASS

for tag in $@; do
    echo deploying cion/web:$tag...
    docker image tag $IMAGE cion/web:$tag
    docker push cion/web:$tag
done

docker logout