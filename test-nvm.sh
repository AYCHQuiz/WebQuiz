#!/usr/bin/env bash

# Run test cases on all supported Node.js versions
# 1) Install nvm: https://github.com/creationix/nvm
# 2) Install all node versions:
# 2.1) nvm install 6
# 2.2) nvm install 8
# 3) ./test-nvm.sh
# 4) profit

. "$HOME/.nvm/nvm.sh"  # This loads nvm

nvm exec 6 npm test && \
nvm exec 8 npm test
