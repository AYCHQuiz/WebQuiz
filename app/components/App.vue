<template>
<div class="container grid-480">
<quiz-progress :total="questions.length" :current="currentQuestionIndex"></quiz-progress>
<startpage v-on:start="start" v-show="showStartpage"></startpage>
<question v-on:next="next" v-if="showQuestion" :content="currentQuestion"></question>
<evaluation v-show="showEvaluation"></evalution>
</div>
</template>

<script>
declare var require: any;

const Progress = require('./Progress.vue').default;
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
                this.questions = JSON.parse(req.responseText);
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

                    this.showEvaluation = true;
                }
            });
        }
    },
    components: {
        'quiz-progress': Progress,
        'startpage': Startpage,
        'question': Question,
        'evaluation': Evaluation
    }
}
</script>
