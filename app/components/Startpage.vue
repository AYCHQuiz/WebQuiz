<template>
<div>
    <h3>Startpage</h3>
    <p>Select the topics you are interested in:</p>
    <form v-on:submit.prevent>
        <div class="form-group" v-for="tag in tags">
            <label class="form-checkbox">
                <input type="checkbox" v-model="selectedTags" v-bind:value="tag" />
                <i class="form-icon"></i> {{ tag }}
            </label>
        </div>
    </form>
    <p>There are {{ numQuestions }} questions matching your interests.</p>
    <button class="btn btn-primary btn-block" @click="startQuiz">Start quiz</button>
</div>
</template>

<script>
export default {
    data: () => {
        return {
            tags: [],
            selectedTags: [],
            numQuestions: 0
        };
    },
    methods: {
        startQuiz: function() {
            this.$emit('start', this.selectedTags.slice());
        }
    },
    watch: {
        selectedTags: function(newTags) {
            const req = new XMLHttpRequest();
            req.addEventListener("load", () => {
                this.numQuestions = JSON.parse(req.responseText).count;
            });
            req.open("GET", "/count_questions?tags=" + newTags.join("|"));
            req.send();
        }
    },
    created: function() {
        const req = new XMLHttpRequest();
        req.addEventListener("load", () => {
            this.tags = JSON.parse(req.responseText);
        });
        req.open("GET", "/tags");
        req.send();
    }
}
</script>
