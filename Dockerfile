FROM node:7-onbuild
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN $HOME/.yarn/bin/yarn
RUN npm run buildp
ENV NODE_ENV production
CMD node server.js example-quiz
