<template>
<div class="container grid-480">
<startpage v-on:start="start" v-show="showStartpage"></startpage>
<question v-on:next="next" v-if="showQuestion"
    :content="currentQuestion" :currentNum="currentQuestionIndex"
    :totalNum="questions.length" v-on:cancel="cancel" />
<evaluation v-show="showEvaluation"></evalution>
</div>
</template>

<script>
declare var require: any;

const Startpage = require('./Startpage.vue').default;
const Question = require('./Question.vue').default;
const Evaluation = require('./Evaluation.vue').default;

export default {
    data: () => {
        return {
            showStartpage: true,
            showQuestion: false,
            showEvaluation: false,
            questions: [],
            currentQuestionIndex: 0,
            currentQuestion: []
        };
    },
    methods: {
        start: function(tags) {
            const req = new XMLHttpRequest();
            req.addEventListener("load", () => {
                this.questions = JSON.parse(req.responseText).data;
                localStorage.setItem("quiz", req.responseText);
                this.currentQuestion = this.questions[0];
                this.showStartpage = false;
                this.showQuestion = true;
            });
            req.open("GET", "/api/quiz?tags=" + tags.join("|"));
            req.send();
        },
        next: function() {
            // HACK: force rendering on Question component
            // first: destroy old component (via v-if)
            this.showQuestion = false;

            this.$nextTick(() => { // second: wait one time slit
                this.currentQuestionIndex ++;
                if(this.currentQuestionIndex < this.questions.length) {
                    this.currentQuestion = this.questions[this.currentQuestionIndex];
                    this.showQuestion = true; // third: create new component (via v-if)
                } else {
                    console.log("show eval");
                    this.showEvaluation = true;
                }
            });
        },
        cancel: function() {
            this.showQuestion = false;
            this.showStartpage = true;
        }
    },
    components: {
        'startpage': Startpage,
        'question': Question,
        'evaluation': Evaluation
    }
}
</script>
