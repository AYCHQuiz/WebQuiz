# `web-quiz`: a modern, mobile-first web quiz for STEM courses

[![Build Status](https://travis-ci.org/tum-rt/web-quiz.svg?branch=master)](https://travis-ci.org/tum-rt/web-quiz)
[![dependencies Status](https://david-dm.org/tum-rt/web-quiz/status.svg)](https://david-dm.org/tum-rt/web-quiz)
[![devDependencies Status](https://david-dm.org/tum-rt/web-quiz/dev-status.svg)](https://david-dm.org/tum-rt/web-quiz?type=dev)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e472f63f397543a584f70b427b5ef51d)](https://www.codacy.com/app/tum-rt/web-quiz?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tum-rt/web-quiz&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/tum-rt/web-quiz/badges/gpa.svg)](https://codeclimate.com/github/tum-rt/web-quiz)
[![Coverage Status](https://coveralls.io/repos/github/tum-rt/web-quiz/badge.svg?branch=master)](https://coveralls.io/github/tum-rt/web-quiz?branch=master)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/web-quiz.svg)](https://saucelabs.com/u/web-quiz)

## Features
* Basic multiple choice questions
    * :radio_button: single answer
    * :ballot_box_with_check: multiple answer
* :1234: Support for numerical problems with a tolerance region for the correct answers
* Plot and LaTeX rendering
* :heavy_plus_sign: First-class latex math support (enclosed in `$`)
* :racehorse: Mobile-first, responsive web design
* :cloud: Lightweight question specification in YAML
* Configurable multi-language support:
    * :uk: English
    * :de: German
    * :ru: Russian
    * :es: Spanish

## Installation

Requirements: Node.js >= 6.x

We use :smiley_cat: [Yarn](https://yarnpkg.com/) for package management.
Please install it as described [here](https://yarnpkg.com/en/docs/install).

```sh
git clone https://github.com/tum-rt/web-quiz.git
cd web-quiz
yarn
npm run dev
```

## Production run
```sh
npm run buildp
export NODE_ENV=production
node server.js example-quiz
```

## Convenience scripts

| Command               | Action                                                         |
|:----------------------|:---------------------------------------------------------------|
| `npm run dev`         | run server with example-quiz in development mode               |
| `npm run build`       | build the app                                                  |
| `npm run buildp`      | production build, `bundle.js` is minified                      |
| `npm run watch`       | watch sources and rebuild the client app on changes            |
| `npm run doc`         | generate API documentation, see `./apidoc/index.html`          |
| `npm run test`        | runs backend unit tests                                        |
| `npm run coverage`    | runs backend unit tests with coverage                          |
| `npm run karma`       | run front-end browser tests once                               |
| `npm run karma-watch` | run front-end browser tests, let browsers open and watch files |

## Custom quiz questions
Create an empty folder and with a file called `_config.yml`. This is the
main configuration file for your quiz.

```yaml
url: https://example.com # the publicly available scheme+domain of the quiz
title: Title is inserted in the header and the HTML title
description: >
    The description is inserted in HTML meta tags
    to be used by Facebook and Twitter.
lang: en # or 'de' or 'ru' or 'es'
max_questions_per_session: 10 # number of questions per quiz session
footer: Put a custom footer here. You may use any <i>kind of HTML</i>.
about: Put a custom about text here. You may use any HTML.
```

Now you can add any question files.

Each question file must end in `.yml`.
They can be directly placed in your directory or in any sub-directory that does
not start with a dot (e.g. `.cache`).

A question file is written in YAML and look like this:

```yaml
uid: put_a_unique_identifier_string_here
tags: [a, list, of, tags]
content:
- header1: Web Quiz
- text: This project is programmed in
- task_mc_one_correct:
    correct_answer:
    - JavaScript
    wrong_answers:
    - Golang
    - Python
    - Groovy
- separator
- text: "Check the browsers web-quiz supports:"
- hint: Nope, we don't use Windows XP anymore.
- task_mc_multiple_correct:
    correct_answers:
    - Firefox
    - Chrome
    - Safari
    - Edge
    wrong_answers:
    - Internet Explorer
    - Lynx
```

You can find further examples in the `example-quiz` folder of this project.

## Docker Quickstart

```sh
git clone https://github.com/tum-rt/web-quiz.git
cd web-quiz
docker build -t web-quiz .
docker run --rm -it -p 3000:3000 web-quiz
```
