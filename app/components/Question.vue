<template>
<div>
    <form v-on:submit.prevent>
        <snippet v-for="(snippet, index) in content"
            :snippet="snippet" :index="index" @input="input" />
    </form>
    <button class="btn btn-primary btn-block mt-10" @click="submit">Submit answers</button>
    </div>
</div>
</template>

<script>
declare var require: any;

const Snippet = require('./Snippet.vue').default;

export default {
    props: ["content"],
    data: () => {
        return {
            answers: {}
        };
    },
    methods: {
        submit: function() {
            console.log(JSON.stringify(this.answers));
            this.answers = {};
            console.log(JSON.stringify(this.answers));
            this.$nextTick(() => {
                this.$emit('next');
            });
        },
        input: function(index, value) {
            this.answers[index] = value;
            console.log(JSON.stringify(this.answers));
        }
    },
    components: {
        "snippet": Snippet
    }
}
</script>
