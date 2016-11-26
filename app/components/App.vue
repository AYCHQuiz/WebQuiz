<template>
<div class="container grid-480">
<startpage v-on:start="start" v-show="showStartpage"></startpage>
<question v-on:next="next" v-if="showQuestion"
    :content="currentQuestion" :currentNum="currentQuestionIndex"
    :totalNum="questions.length" v-on:cancel="cancel" />
<evaluation v-if="showEvaluation" :questions="questions" @close="closeEval" />
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
                this.currentQuestionIndex = 0;
                this.allAnswers = [];
                this.showStartpage = false;
                this.showQuestion = true;
            });
            req.open("GET", "/api/quiz?tags=" + tags.join("|"));
            req.send();
        },
        next: function(answers) {
            // HACK: force rendering on Question component
            // first: destroy old component (via v-if)
            this.showQuestion = false;

            this.mergeAnswers(answers);

            this.$nextTick(() => { // second: wait one time slot
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
        },
        closeEval: function() {
            this.showEvaluation = false;
            this.showStartpage = true;
        },
        mergeAnswers: function(userAnswers) {
            this.currentQuestion.forEach((snippet, index) => {
                const userAnswer = userAnswers[index];

                if(snippet.task_text) {
                    snippet.task_text.user_answer = userAnswer;
                    snippet.task_text.user_correct = userAnswer ==
                        snippet.task_text.correct_answer;
                } else if(snippet.task_number) {
                    snippet.task_number.user_answer = userAnswer;
                    snippet.task_number.user_correct =
                        Math.abs(snippet.task_number.correct_answer - userAnswer)
                        <= snippet.task_number.abs_tol;
                } else if(snippet.task_mc_one_correct) {
                    snippet.task_mc_one_correct.answers.forEach(
                    (answer, answerIndex) => {
                        answer.user_checked = answerIndex === userAnswer;
                    });
                } else if(snippet.task_mc_multiple_correct) {
                    snippet.task_mc_multiple_correct.answers.forEach(
                    (answer, answerIndex) => {
                        answer.user_checked = userAnswer &&
                            userAnswer.indexOf(answerIndex) !== -1;
                    });
                }
            });
        }
    },
    components: {
        'startpage': Startpage,
        'question': Question,
        'evaluation': Evaluation
    }
}
</script>
