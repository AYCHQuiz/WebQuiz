<template>
    <span>
        <template v-for="partial in content">
            <template v-if="partial.text">{{ partial.text }}</template>
            <img v-if="partial.math" :src="buildUrl(partial.math)">
        </template>
    </span>
</template>

<script>
export default {
    props: ["value"],
    data: () => {
        return {
            content: []
        };
    },
    created: function() {
        this.content = [];
        const text = "" + this.value;
        let lastIndex = 0;
        let insideMath = false;
        let index;
        while((index = text.indexOf("$", lastIndex)) != -1) {
            const part = text.substring(lastIndex, index);
            if(insideMath) {
                this.content.push({ math: part });
            } else {
                this.content.push({ text: part });
            }
            insideMath = !insideMath;
            lastIndex = index + 1;
        }
        if(lastIndex < text.length) {
            this.content.push({ text: text.substring(lastIndex) });
        }
    },
    methods: {
        buildUrl: function(math) {
            return "/api/math/tex/svg?input=" + encodeURIComponent(math);
        }
    }
}
</script>
