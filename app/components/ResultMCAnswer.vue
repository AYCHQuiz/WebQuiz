<template>
    <div class="quiz-answer-box" :style="style">
        <template v-if="type === 'checkbox'">
            <i class="fa fa-check-square-o fa-fw" v-if="answer.user_checked"></i>
            <i class="fa fa-square-o fa-fw" v-else></i>
        </template>
        <template v-else>
            <i class="fa fa-dot-circle-o fa-fw" v-if="answer.user_checked"></i>
            <i class="fa fa-circle-o fa-fw" v-else></i>
        </template>
        <i class="fa fa-check fa-fw" v-if="answer.correct"></i>
        <i class="fa fa-check fa-fw invisible" v-else></i>
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
