<template>
<div>
    <header class="navbar">
        <section class="navbar-section">
            <a href="#" class="btn btn-link">Web Quiz</a>
            <button href="#" class="btn float-right" @click="cancel">Cancel</button>
        </section>
    </header>
    <quiz-progress :total="totalNum" :current="currentNum"></quiz-progress>
    <form v-on:submit.prevent>
        <snippet v-for="(snippet, index) in content"
            :snippet="snippet" :index="index" @input="input" />
    </form>
    <button class="btn btn-primary btn-block mt-10" @click="submit">Submit answers</button>
    </div>
</div>
</template>

<script>
declare var require: any;

const Snippet = require('./Snippet.vue').default;
const Progress = require('./Progress.vue').default;

export default {
    props: ["content", "currentNum", "totalNum"],
    data: () => {
        return {
            answers: {}
        };
    },
    methods: {
        submit: function() {
            this.answers = {};
            this.$nextTick(() => {
                this.$emit('next');
            });
        },
        input: function(index, value) {
            this.answers[index] = value;
            console.log(JSON.stringify(this.answers));
        },
        cancel: function() {
            this.$emit("cancel");
        }
    },
    components: {
        "snippet": Snippet,
        'quiz-progress': Progress
    }
}
</script>
