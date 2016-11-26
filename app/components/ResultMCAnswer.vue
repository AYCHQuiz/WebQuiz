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
        <i class="fa fa-check fa-fw" v-if="answer.user_checked && answer.correct"></i>
        <i class="fa fa-close fa-fw" v-else-if="answer.user_checked && !answer.correct"></i>
        <i class="fa fa-close fa-fw" v-else-if="!answer.user_checked && answer.correct"></i>
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
        style: function() {
            let bgcolor = "#FFFFFF", fgcolor = "#000000";
            if(this.answer.user_checked && this.answer.correct) {
                bgcolor = "#8A97F9";
            } else if(this.answer.user_checked !== this.answer.correct) {
                bgcolor = "#FFA500";
            }

            return {
                "background-color": bgcolor,
                "color": fgcolor
            };
        }
    },
    components: {
        "fl-text": FlavoredText
    }
}
</script>

<style>
.quiz-answer-box {
    display: block;
    width: 100%;
    border: .1rem solid #5764c6;
    border-radius: .3rem;
    font-size: 1.4rem;
    /*height: 3.2rem;*/
    padding: .7rem 1.5rem;
    margin-top: 5px;
}
</style>
