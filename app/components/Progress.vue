<template>
    <div class="progress">
        <div class="progress-bar" :style="style">
            {{ current + 1 }} / {{ total }}
        </div>
    </div>
</template>

<script>
export default {
    props: ["total", "current"],
    computed: {
        style: function() {
            const percent = (this.current + 1) / this.total * 100;
            return {
                "width": percent + "%"
            };
        }
    }
}
</script>

<style>
.progress {
    height: 3.2rem;
    margin-bottom: 10px;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
}
.progress-bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 1.4rem;
    line-height: 3.2rem;
    color: #fff;
    text-align: center;
    background-color: #8A97F9;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
            box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
    -webkit-transition: width .6s ease;
         -o-transition: width .6s ease;
            transition: width .6s ease;
}
</style>
