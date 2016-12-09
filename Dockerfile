FROM node:7-onbuild
RUN npm run build
CMD node server.js example-quiz
