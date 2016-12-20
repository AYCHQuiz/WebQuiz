<template>
    <span>
        <template v-for="partial in content">
            <template v-if="partial.text">{{ partial.text }}</template>
            <img v-if="partial.math" :src="buildUrl(partial.math)">
        </template>
    </span>
</template>

<script>
const regexIndexOf = (str, regex, startpos) => {
    const indexOf = str.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};

const replaceEscapes = (text) => text.replace(/\\\$/g, "$$");

export default {
    props: ["value"],
    data() {
        return {
            content: []
        };
    },
    created() {
        this.content = [];
        const text = typeof this.value === "undefined" ? "" : this.value;
        let lastIndex = 0;
        let insideMath = false;
        let index;
        while((index = regexIndexOf(text, /(^|[^\\])\$/, lastIndex)) != -1) {
            // offset by 1 if a character (not '\') before $ was matched
            const offset = text[index] === "$" ? 0 : 1;
            const part = text.substring(lastIndex, index + offset);
            if(insideMath) {
                this.content.push({ math: part });
            } else {
                this.content.push({ text: replaceEscapes(part) });
            }
            insideMath = !insideMath;
            lastIndex = index + 1 + offset;
        }
        if(lastIndex < text.length) {
            this.content.push({ text: replaceEscapes(text.substring(lastIndex)) });
        }
    },
    methods: {
        buildUrl(math) {
            return "/api/math/tex/svg?input=" + encodeURIComponent(math);
        }
    }
}
</script>
