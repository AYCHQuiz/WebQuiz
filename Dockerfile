FROM node:8
WORKDIR /src
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN $HOME/.yarn/bin/yarn
COPY . /src
RUN yarn
RUN yarn run buildp
ENV NODE_ENV production
CMD node server.js example-quiz
EXPOSE 3000
