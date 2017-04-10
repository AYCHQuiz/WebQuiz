<template>
<div>
    <navbar>
        <div class="columns">
            <div class="column col-10" style="vertical-align:sub;">
                <img class="nav-icon" src="/public/favicon.png">
                <div class="nav-title">{{ title }}</div>
            </div>
            <div class="column col-2">
                <button class="btn btn-link float-right" @click="showAbout">{{ $t("about") }}</button>
            </div>
        </div>
    </navbar>
    <p>{{ $t("select_topics") }}</p>
    <form @submit.prevent>
        <div class="form-group" v-for="tag in tags">
            <label class="form-checkbox quiz-answer-box"
                :class="{disabled: tag.count === 0, 'quiz-answer-box-highlight': selectedTags.indexOf(tag.tag) >= 0}">
                <i class="icon-check-square-o" v-if="selectedTags.indexOf(tag.tag) >= 0"></i>
                <i class="icon-square-o" v-else></i>
                <input type="checkbox" v-model="selectedTags" :value="tag.tag" />
                {{ tag.tag }} ({{ tag.count }})
            </label>
        </div>
        <p class="mt-10">
            {{ $tc("there_are_x_questions", numQuestions, {count: numQuestions}) }}
        </p>
        <template v-if="showError">
            <div class="toast toast-danger mb-5">
                Network Error
            </div>
        </template>
        <button type="submit" class="btn btn-primary btn-block"
            @click="startQuiz" :disabled="startDisabled">{{ $t("start_quiz") }}
        </button>
    </form>
    <quiz-dialog v-show="showAboutDialog" :title="title"
        :positive-text="$t('close')" @click="dialogClick">
        <div v-html="aboutText"></div>
    </quiz-dialog>
</div>
</template>

<script>
declare var require: any;

const Navbar = require("./Navbar.vue").default;
const Dialog = require("./Dialog.vue").default;

import config from "../config";
import {getTagsWithCount, getQuiz} from "../api";

export default {
    data() {
        return {
            title: config.title,
            aboutText: config.about,
            tags: [],
            selectedTags: [],
            startDisabled: true,
            numQuestions: 0,
            showAboutDialog: false,
            showError: false
        };
    },
    methods: {
        startQuiz() {
            getQuiz(this.selectedTags, (err, data) => {
                if(err) {
                    console.error("API failed: /api/quiz", err);
                    this.showError = true;
                    return;
                }

                this.$emit('start', data);
            });
        },
        updateTags(userSelectedTags) {
            getTagsWithCount(userSelectedTags, (err, data) => {
                if(err) {
                    console.error("API failed: /api/tags_with_count", err);
                    this.showError = true;
                    return;
                }
                this.tags = data.tags;
                this.numQuestions = data.total;
                this.startDisabled = this.numQuestions === 0;
                //this.showError = false;
            });
        },
        showAbout() {
            this.showAboutDialog = true;
        },
        dialogClick() {
            this.showAboutDialog = false;
        }
    },
    watch: {
        selectedTags(newTags) {
            this.updateTags(newTags);
        }
    },
    created() {
        this.updateTags([]);
    },
    components: {
        "navbar": Navbar,
        "quiz-dialog": Dialog
    }
}
</script>
