declare var require: any;

import * as Vue from 'vue';
const VueI18n = require("vue-i18n");
const App = require('./components/App.vue').default;

import {QuizConfig} from "./interfaces";
declare var QUIZ: QuizConfig;
document.title = QUIZ.title;

Vue.use(VueI18n);
(<any>Vue.config).lang = QUIZ.lang;
(<any>Vue).locale("en", require("json-loader!./i18n/en.json"));
(<any>Vue).locale("de", require("json-loader!./i18n/de.json"));
(<any>Vue).locale("ru", require("json-loader!./i18n/ru.json"));

new Vue({
    el: "#app",
    //components: { App },
    render: h => h(App)
});
