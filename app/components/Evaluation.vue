<template>
<div>
    <header class="navbar">
        <section class="navbar-section">
            <!--<a href="#" class="btn btn-link">Web Quiz</a>-->
            <button href="#" class="btn float-right" @click="close">Close</button>
        </section>
    </header>
    <h3>Results</h3>
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
        "snippet": ResultSnippet
    }
}
</script>
