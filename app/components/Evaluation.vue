<template>
<div>
    <navbar>
        <div class="columns">
            <div class="column col-10">
                <div class="nav-title">{{ $t("results", {percent: correctPercent}) }}</div>
            </div>
            <div class="column col-2">
                <button class="btn float-right" @click="close">{{ $t("close") }}</button>
            </div>
        </div>
    </navbar>
    <form v-on:submit.prevent>
        <template v-for="(question, index) in questions">
            <h3>{{ $t("question_x_result", {num: index + 1, correct: question.correct_tasks, total: question.total_tasks }) }}</h3>
            <snippet v-for="snippet in question.content" :snippet="snippet" />
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
    computed: {
        correctPercent: function() {
            const total = this.questions
            .map((q) => q.total_tasks)
            .reduce((a, b) => a + b, 0);

            const correct = this.questions
            .map((q) => q.correct_tasks)
            .reduce((a, b) => a + b, 0);

            return Math.round(correct / total * 100);
        }
    },
    components: {
        "snippet": ResultSnippet,
        "navbar": Navbar
    }
}
</script>
