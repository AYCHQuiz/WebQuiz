#!/usr/bin/env bash

# Run test cases on all supported Node.js version
# 1) Install nvm: https://github.com/creationix/nvm
# 2) Install all node versions:
# 2.1) nvm install 4
# 2.2) nvm install 5
# 2.3) nvm install 6
# 2.4) nvm install 7
# 3) run ./test-nvm.sh
# 4) profit

. "$HOME/.nvm/nvm.sh"  # This loads nvm

nvm exec 4 npm test && \
nvm exec 5 npm test && \
nvm exec 6 npm test && \
nvm exec 7 npm test
