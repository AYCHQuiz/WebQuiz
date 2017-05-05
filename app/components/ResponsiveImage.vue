<template>
    <img class="img-responsive" :src="snippet.source_1x" :srcset="srcset"
        :alt="snippet.description" :style="{width: width, margin: '0 auto'}" />
</template>

<script>
export default {
    props: ["snippet"],
    computed: {
        srcset() {
            return ["1x", "2x", "4x"]
                .filter((key) => this.snippet[`source_${key}`])
                .map((key) => `${this.snippet["source_" + key]} ${key}`)
                .join(",");
        },
        width() {
            if (typeof this.snippet.width === "undefined") {
                return "100%"; // default to full width
            } else {
                return `${this.snippet.width}%`;
            }
        }
    }
}
</script>
