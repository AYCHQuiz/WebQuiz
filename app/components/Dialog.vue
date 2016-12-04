<template>
    <div class="modal modal-sm active">
        <div class="modal-overlay"></div>
        <div class="modal-container">
            <div class="modal-header">
                <button class="btn btn-clear float-right" @click="negativeAction"></button>
                <div class="modal-title">{{ title }}</div>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
            <div class="modal-footer">
                <button v-if="negativeText" class="btn btn-link" @click="negativeAction">{{ negativeText }}</button>
                <button class="btn btn-primary" @click="positiveAction">{{ positiveText }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["title", "negativeText", "positiveText"],
    methods: {
        positiveAction: function() {
            this.$emit("click", "positive");
        },
        negativeAction: function() {
            this.$emit("click", "negative");
        }
    }
}
</script>
