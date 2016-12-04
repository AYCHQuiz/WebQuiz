<template>
<div>
    <navbar>
        <div class="columns">
            <div class="column col-10">
                <div class="nav-title">Results</div>
            </div>
            <div class="column col-2">
                <button class="btn float-right" @click="close">Close</button>
            </div>
        </div>
    </navbar>
    <form v-on:submit.prevent>
        <template v-for="question in questions">
            <snippet v-for="snippet in question" :snippet="snippet" />
        </template>
    </form>
</div>
</template>

<script>
declare var require: any;

const ResultSnippet = require('./ResultSnippet.vue').default;
const Navbar = require("./Navbar.vue").default;

export default {
    props: ["questions"],
    data: () => {
        return {};
    },
    methods: {
        close: function() {
            this.$emit("close");
        }
    },
    components: {
        "snippet": ResultSnippet,
        "navbar": Navbar
    }
}
</script>
