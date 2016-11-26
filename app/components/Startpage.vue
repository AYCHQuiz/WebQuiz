<template>
<div>
    <h3>Start page</h3>
    <p>Select the topics you are interested in:</p>
    <form v-on:submit.prevent>
        <div class="form-group" v-for="tag in tags">
            <label class="form-checkbox">
                <input type="checkbox" v-model="selectedTags" v-bind:value="tag" />
                <i class="form-icon"></i> {{ tag }}
            </label>
        </div>
    </form>
    <p>
        There {{ numQuestions == 1 ? 'is' : 'are' }}
        {{ numQuestions }} {{ numQuestions == 1 ? 'question' : 'questions' }}
        matching your interests.
    </p>
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
        },
        updateCount: function(tags) {
            const req = new XMLHttpRequest();
            req.addEventListener("load", () => {
                this.numQuestions = JSON.parse(req.responseText).data;
            });
            req.open("GET", "/api/count_questions?tags=" + tags.join("|"));
            req.send();
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
    }
}
</script>
