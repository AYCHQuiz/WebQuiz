declare var require: any;

// Load global CSS files
require("spectre.css/dist/spectre.min.css");
require("./fontello/css/webquiz.css");
require("./quiz.css");

import Vue from "vue";
import config from "./config";
import {prewarmTagsWithCountCache} from "./api";
const VueI18n = require("vue-i18n");
const App = require("./components/App.vue").default;

prewarmTagsWithCountCache([], JSON.parse(document.getElementById("tags_with_count").innerHTML));

document.title = config.title;

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: config.lang,
    messages: {
        "en": require("json-loader!./i18n/en.json"),
        "de": require("json-loader!./i18n/de.json"),
        "ru": require("json-loader!./i18n/ru.json"),
        "es": require("json-loader!./i18n/es.json"),
        "bar": require("json-loader!./i18n/bar.json"),
    }
});

new Vue(<Vue.ComponentOptions<Vue>>{
    i18n: i18n,
    el: "#app",
    //components: { App },
    render: h => h(App)
});
