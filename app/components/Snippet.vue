<template>
<div>
    <div v-if="snippet.text" class="form-group mt-10">
        <label class="form-label"><fl-text :value="snippet.text"></label>
    </div>
    <h4 v-if="snippet.header1">
        <fl-text :value="snippet.header1">
    </h4>
    <h5 v-if="snippet.header2">
        <fl-text :value="snippet.header2">
    </h5>
    <h6 v-if="snippet.header3">
        <fl-text :value="snippet.header3">
    </h6>
    <div v-if="snippet === 'separator'" class="divider"></div>
    <img v-if="snippet.image" :src="snippet.image" class="img-responsive" />
    <div v-if="snippet.hint" class="hint">
        <button v-show="!showHint" class="btn" v-on:click="triggerHint">{{ $t("show_hint") }}</button>
        <span v-show="showHint" class="hint-content">
            <fl-text :value="snippet.hint">
        </span>
    </div>
    <div v-if="snippet.task_text" class="input-group">
        <span v-if="snippet.task_text.before" class="input-group-addon">
            <fl-text :value="snippet.task_text.before">
        </span>
        <input type="text" class="form-input" v-model="taskText">
        <span v-if="snippet.task_text.after" class="input-group-addon">
            <fl-text :value="snippet.task_text.after">
        </span>
    </div>
    <div v-if="snippet.task_number" class="input-group">
        <span v-if="snippet.task_number.before" class="input-group-addon">
            <fl-text :value="snippet.task_number.before">
        </span>
        <input type="number" class="form-input" v-model="taskNumber">
        <span v-if="snippet.task_number.after" class="input-group-addon">
            <fl-text :value="snippet.task_number.after">
        </span>
    </div>
    <template v-if="snippet.task_mc_multiple_correct">
        <div v-for="(answer, answerIndex) in snippet.task_mc_multiple_correct.answers"
            class="form-group">
            <label class="form-checkbox">
                <input type="checkbox" v-model="taskMCMultiple" :value="answerIndex">
                <i class="form-icon"></i> <fl-text :value="answer.value">
            </label>
        </div>
    </template>
    <template v-if="snippet.task_mc_one_correct">
        <div v-for="(answer, answerIndex) in snippet.task_mc_one_correct.answers"
            class="form-group">
            <label class="form-radio">
                <input type="radio" :name="index" :value="answerIndex" v-model="taskMCOne">
                <i class="form-icon"></i> <fl-text :value="answer.value">
            </label>
        </div>
    </template>
</div>
</template>

<script>
declare var require: any;

const FlavoredText = require("./FlavoredText.vue").default;

export default {
    data: () => {
        return {
            taskMCOne: undefined,
            taskMCMultiple: [],
            taskNumber: "",
            taskText: "",
            showHint: false
        };
    },
    props: ["snippet", "index", "value"],
    methods: {
        triggerHint: function() {
            this.showHint = true;
        }
    },
    watch: {
        taskMCOne: function() {
            this.$emit("input", this.index, this.taskMCOne);
        },
        taskMCMultiple: function() {
            this.$emit("input", this.index, this.taskMCMultiple);
        },
        taskNumber: function() {
            this.$emit("input", this.index, this.taskNumber);
        },
        taskText: function() {
            this.$emit("input", this.index, this.taskText);
        }
    },
    components: {
        "fl-text": FlavoredText
    }
}
</script>
