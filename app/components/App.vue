<template>
<div class="container grid-480">
<startpage @start="start" v-show="show == 'startpage'"></startpage>
<question @next="next" v-if="show == 'question'"
    :content="currentQuestion.content" :currentNum="currentQuestionIndex"
    :totalNum="questions.length" @cancel="goBackToStartpage" />
<evaluation v-if="show == 'evaluation'" :questions="questions" @close="goBackToStartpage" />
<div class="divider" v-if="footer"></div>
<div v-html="footer"></div>
</div>
</template>

<script>
declare var require: any;

const Startpage = require('./Startpage.vue').default;
const Question = require('./Question.vue').default;
const Evaluation = require('./Evaluation.vue').default;

import config from "../config";

const STATE_KEY = "state"; // Key to use in localStorage
const STATE_VERSION = 1;   // Only load states of the same version

export default {
    data() {
        return {
            footer: config.footer,
            show: "startpage",
            questions: [],
            currentQuestionIndex: 0,
            currentQuestion: []
        };
    },
    created() {
        this.loadState();
    },
    methods: {
        start(data) {
            this.questions = data;
            this.currentQuestion = this.questions[0];
            this.currentQuestionIndex = 0;
            this.allAnswers = [];
            this.show = "question";
            this.scrollUp();
            this.saveState();
        },
        next(answers) {
            // HACK: force rendering on Question component
            // first: destroy old component (via v-if)
            this.show = "";

            this.mergeAnswers(answers);

            this.$nextTick(() => { // second: wait one time slot
                this.currentQuestionIndex ++;
                if(this.currentQuestionIndex < this.questions.length) {
                    this.currentQuestion = this.questions[this.currentQuestionIndex];
                    this.show = "question"; // third: create new component (via v-if)
                } else {
                    this.show = "evaluation";
                }
                this.scrollUp();
                this.saveState();
            });
        },
        goBackToStartpage() {
            this.show = "startpage";
            this.deleteState();
        },
        mergeAnswers(userAnswers) {
            let totalTasks = 0;
            let correctTasks = 0;

            this.currentQuestion.content.forEach((snippet, index) => {
                const userAnswer = userAnswers[index];

                if(snippet.task_text) {
                    const task = snippet.task_text;
                    const trimmedUserAnswer = userAnswer ? userAnswer.trim() : "";
                    task.user_answer = trimmedUserAnswer;
                    task.user_correct =
                        task.correct_answers
                        .map((answer) => answer.toLowerCase())
                        .indexOf(trimmedUserAnswer.toLowerCase()) > -1;
                    totalTasks ++;
                    correctTasks += task.user_correct ? 1 : 0;
                } else if(snippet.task_number) {
                    const task = snippet.task_number;
                    task.user_answer = userAnswer;
                    task.user_correct =
                        Math.abs(task.correct_answer - userAnswer)
                        <= task.abs_tol;
                    totalTasks ++;
                    correctTasks += task.user_correct ? 1 : 0;
                } else if(snippet.task_mc_one_correct) {
                    const task = snippet.task_mc_one_correct;
                    task.answers.forEach(
                    (answer, answerIndex) => {
                        answer.user_checked = answerIndex === userAnswer;
                        correctTasks +=
                            answer.user_checked && answer.correct ? 1 : 0;
                    });
                    totalTasks ++;
                } else if(snippet.task_mc_multiple_correct) {
                    let allAnswersCorrect = true;
                    snippet.task_mc_multiple_correct.answers.forEach(
                    (answer, answerIndex) => {
                        answer.user_checked = userAnswer &&
                            userAnswer.indexOf(answerIndex) !== -1;
                        if(answer.user_checked !== answer.correct) {
                            allAnswersCorrect = false;
                        }
                    });
                    totalTasks ++;
                    correctTasks += allAnswersCorrect ? 1 : 0;
                }
            });

            this.currentQuestion.total_tasks = totalTasks;
            this.currentQuestion.correct_tasks = correctTasks;
        },
        scrollUp() {
            window.scrollTo(0, 0);
        },
        saveState() {
            localStorage.setItem(STATE_KEY, JSON.stringify({
                "version": STATE_VERSION,
                "questions": this.questions,
                "currentQuestionIndex": this.currentQuestionIndex
            }));
        },
        deleteState() {
            localStorage.removeItem(STATE_KEY);
        },
        loadState() {
            const state = JSON.parse(localStorage.getItem(STATE_KEY));
            if(state !== null && state.version === STATE_VERSION) {
                this.questions = state.questions;
                this.currentQuestionIndex = state.currentQuestionIndex;

                if(this.currentQuestionIndex < this.questions.length) {
                    this.show = "question";
                    this.currentQuestion = this.questions[this.currentQuestionIndex];
                } else {
                    this.show = "evaluation";
                }
            }
        }
    },
    components: {
        'startpage': Startpage,
        'question': Question,
        'evaluation': Evaluation
    }
}
</script>
