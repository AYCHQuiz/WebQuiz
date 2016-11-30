<template>
<div>
    <div class="columns nav">
        <div class="column col-10">
            <quiz-progress :total="totalNum" :current="currentNum"></quiz-progress>
        </div>
        <div class="column col-2">
            <button class="btn float-right" @click="cancel">Close</button>
        </div>
    </div>
    <form v-on:submit.prevent style="margin-top: 50px;">
        <snippet v-for="(snippet, index) in content"
            :snippet="snippet" :index="index" @input="input" />
    </form>
    <button class="btn btn-primary btn-block mt-10" @click="submit">Submit answers</button>
    <quiz-dialog v-show="showCancelDialog" title="Web-Quiz"
        positive-text="Close quiz" negative-text="Cancel" @click="dialogClick">
        You can't come back. Your progress will be lost.
    </quiz-dialog>
</div>
</template>

<script>
declare var require: any;

const Snippet = require('./Snippet.vue').default;
const Progress = require('./Progress.vue').default;
const Dialog = require("./Dialog.vue").default;

export default {
    props: ["content", "currentNum", "totalNum"],
    data: () => {
        return {
            answers: {},
            showCancelDialog: false
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
            this.showCancelDialog = true;
        },
        dialogClick: function(type) {
            this.showCancelDialog = false;
            if(type === "positive") {
                this.$emit("cancel");
            }
        }
    },
    components: {
        "snippet": Snippet,
        "quiz-progress": Progress,
        "quiz-dialog": Dialog
    }
}
</script>

<style>
@media screen and (min-width: 500px) {
    .nav {
        width: 50rem;
    }
}

@media screen and (max-width: 499px) {
    .nav {
        left: 1rem;
        right: 1rem;
    }
}

.nav {
    position: fixed;
    z-index: 1000;
    top: 0;
    background-color: white;
}
</style>
