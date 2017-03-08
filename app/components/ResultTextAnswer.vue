<template>
<div class="input-group">
    <fl-text v-if="snippet.before" :value="snippet.before"
        clazz="input-group-addon" />
    <input readonly :value="snippet.user_answer" class="form-input"
        :style="style"/>
    <input readonly :value="answer" class="form-input"
        v-if="!snippet.user_correct" />
    <fl-text v-if="snippet.after" :value="snippet.after"
        clazz="input-group-addon" />
</div>
</template>

<script>
declare var require: any;

const FlavoredText = require("./FlavoredText.vue").default;

export default {
    props: ["snippet"],
    computed: {
        style() {
            return {
                "background-color": this.snippet.user_correct ?
                    "#8A97F9" : "#FFA500"
            };
        },
        answer() {
            return this.snippet.correct_answer ?
                this.snippet.correct_answer : this.snippet.correct_answers[0];
        }
    },
    components: {
        "fl-text": FlavoredText
    },
}
</script>
