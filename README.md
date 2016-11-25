# `web-quiz`: a modern, mobile-first web quiz for STEM courses

`dev`: [![Build Status](https://travis-ci.org/tum-rt/web-quiz.svg?branch=dev)](https://travis-ci.org/tum-rt/web-quiz)
[![Dependencies](https://david-dm.org/tum-rt/web-quiz/dev.svg)](https://david-dm.org/tum-rt/web-quiz/dev)

## Features
* Basic multiple choice questions (single answer and multiple answer)
* Support for numerical problems with a tolerance region for the correct answers
* Plot and LaTeX rendering
* Mobile-first, responsive web design
* Lightweight question specification in YAML

## Installation

Requirements: Node.js >= 4.x

```sh
git clone https://github.com/tum-rt/web-quiz.git
cd web-quiz
npm install
npm run build
node server.js example-quiz
```

## Generating docs
Install `apidoc` (globally):
```sh
npm install apidoc -g
```
Run it:
```sh
apidoc -i lib/ -o apidoc/
```
