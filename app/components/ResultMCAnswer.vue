<template>
    <div class="quiz-answer-box" :style="style">
        <template v-if="type === 'checkbox'">
            <i class="icon-check-square-o" v-if="answer.user_checked"></i>
            <i class="icon-square-o" v-else></i>
        </template>
        <template v-else>
            <i class="icon-dot-circle-o" v-if="answer.user_checked"></i>
            <i class="icon-circle-o" v-else></i>
        </template>
        <i class="icon-check" v-if="answer.correct"></i>
        <i class="icon-check d-invisible" v-else></i>
        <fl-text :value="answer.value" />
    </div>
</template>

<script>
declare var require: any;

const FlavoredText = require("./FlavoredText.vue").default;

export default {
    props: ["answer", "type"],
    computed: {
        style() {
            let bgcolor = "#FFFFFF";
            if(this.answer.correct && this.answer.user_checked) {
                bgcolor = "#8A97F9";
            } else if(!this.answer.correct && this.answer.user_checked) {
                bgcolor = "#FFA500";
            }

            return {
                "background-color": bgcolor,
            };
        }
    },
    components: {
        "fl-text": FlavoredText
    }
}
</script>
