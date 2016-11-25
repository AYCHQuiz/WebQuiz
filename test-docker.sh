#!/usr/bin/env bash

# Run test cases on all supported Node.js versions
# 1) Install docker: https://docs.docker.com/engine/installation/
# 2) ./test-docker.sh
# 3) profit

# There is no node:5 or node:5-alpine image
docker run --rm -t -v$PWD:/usr/src/app -w/usr/src/app node:4-alpine npm test && \
docker run --rm -t -v$PWD:/usr/src/app -w/usr/src/app node:6-alpine npm test && \
docker run --rm -t -v$PWD:/usr/src/app -w/usr/src/app node:7-alpine npm test
