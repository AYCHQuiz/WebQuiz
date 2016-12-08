<template>
<div>
    <navbar>
        <div class="columns">
            <div class="column col-10" style="vertical-align:sub;">
                <div class="nav-title">{{ title }}</div>
            </div>
            <div class="column col-2">
                <button class="btn btn-link float-right" @click="showAbout">{{ $t("about") }}</button>
            </div>
        </div>
    </navbar>
    <p>{{ $t("select_topics") }}</p>
    <form v-on:submit.prevent>
        <div class="form-group" v-for="tag in tags">
            <label class="form-checkbox">
                <input type="checkbox" v-model="selectedTags" v-bind:value="tag" />
                <i class="form-icon"></i> {{ tag }}
            </label>
        </div>
        <p class="mt-10">
            {{ $tc("there_are_x_questions", numQuestions, {count: numQuestions}) }}
        </p>
        <button type="submit" class="btn btn-primary btn-block"
            @click="startQuiz" :disabled="startDisabled">{{ $t("start_quiz") }}
        </button>
    </form>
    <quiz-dialog v-show="showAboutDialog" title="Web-Quiz"
        :positive-text="$t('close')" @click="dialogClick">
        <p>
            {{ aboutText }}
        </p>
        <p>
        Proudly made with Node.js, Express and Vue.js.
        Developed on <a href="https://github.com/tum-rt/web-quiz" target="_blank">Github</a>.
        </p>
    </quiz-dialog>
</div>
</template>

<script>
declare var require: any;

const Navbar = require("./Navbar.vue").default;
const Dialog = require("./Dialog.vue").default;

import {QuizConfig} from "../interfaces";
declare var QUIZ: QuizConfig;

export default {
    data: () => {
        return {
            title: QUIZ.title,
            aboutText: QUIZ.about,
            tags: [],
            selectedTags: [],
            startDisabled: true,
            numQuestions: 0,
            showAboutDialog: false
        };
    },
    methods: {
        startQuiz: function() {
            this.$emit('start', this.selectedTags.slice());
        },
        updateCount: function(tags) {
            const req = new XMLHttpRequest();
            req.addEventListener("load", () => {
                this.numQuestions = JSON.parse(req.responseText).data;
                this.startDisabled = this.numQuestions === 0;
            });
            req.open("GET", "/api/count_questions?tags=" + tags.join("|"));
            req.send();
        },
        showAbout: function() {
            this.showAboutDialog = true;
        },
        dialogClick: function() {
            this.showAboutDialog = false;
        }
    },
    watch: {
        selectedTags: function(newTags) {
            this.updateCount(newTags);
        }
    },
    created: function() {
        const req = new XMLHttpRequest();
        req.addEventListener("load", () => {
            this.tags = JSON.parse(req.responseText).data;
            this.updateCount([]);
        });
        req.open("GET", "/api/tags");
        req.send();
    },
    components: {
        "navbar": Navbar,
        "quiz-dialog": Dialog
    }
}
</script>
