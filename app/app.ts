declare var require: any;

import * as Vue from 'vue';
const App = require('./components/App.vue').default;

new Vue({
    el: "#app",
    //components: { App },
    render: h => h(App)
});
