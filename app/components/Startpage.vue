<template>
<div>
    <navbar>
        <div class="columns">
            <div class="column col-10" style="vertical-align:sub;">
                <div class="nav-title">Web-Quiz</div>
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
    </form>
    <p>
        {{ $tc("there_are_x_questions", numQuestions, {count: numQuestions}) }}
    </p>
    <button class="btn btn-primary btn-block" @click="startQuiz" :disabled="startDisabled">{{ $t("start_quiz") }}</button>
    <quiz-dialog v-show="showAboutDialog" title="Web-Quiz"
        :positive-text="$t('close')" @click="dialogClick">
        <p>
            [TODO] Custom about message
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

export default {
    data: () => {
        return {
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
