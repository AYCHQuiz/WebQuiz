declare var require: any;

import * as Vue from 'vue';
const VueI18n = require("vue-i18n");
const App = require('./components/App.vue').default;

Vue.use(VueI18n);
(<any>Vue.config).lang = "en"; // TODO make this configurable
(<any>Vue).locale("en", require("json-loader!./i18n/en.json"));
(<any>Vue).locale("de", require("json-loader!./i18n/de.json"));

new Vue({
    el: "#app",
    //components: { App },
    render: h => h(App)
});
