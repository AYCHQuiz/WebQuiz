declare const require: any;

// Load global CSS files
require("spectre.css/dist/spectre.min.css");
require("./fontello/css/webquiz.css");
require("./quiz.css");

import Vue, {ComponentOptions} from "vue";
import VueI18n from "vue-i18n";
import {prewarmTagsWithCountCache} from "./api";
import config from "./config";
const App = require("./components/App.vue").default;

prewarmTagsWithCountCache([], JSON.parse(document.getElementById("tags_with_count").innerHTML));

document.title = config.title;

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: config.lang,
    messages: {
        // alphabetically ordered
        bar: require("json-loader!./i18n/bar.json"),
        de: require("json-loader!./i18n/de.json"),
        en: require("json-loader!./i18n/en.json"),
        es: require("json-loader!./i18n/es.json"),
        ru: require("json-loader!./i18n/ru.json"),
    },
});

/* tslint:disable-next-line:no-unused-expression */
new Vue({
    el: "#app",
    i18n,
    render: (h) => h(App),
} as ComponentOptions<Vue>);
