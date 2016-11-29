<template>
<div>
    <div class="columns">
        <div class="column col-10">
            <quiz-progress :total="totalNum" :current="currentNum"></quiz-progress>
        </div>
        <div class="column col-2">
            <button href="#" class="btn float-right" @click="cancel">Cancel</button>
        </div>
    </div>
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
            this.$emit('next', this.answers);
        },
        input: function(index, value) {
            this.answers[index] = value;
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
