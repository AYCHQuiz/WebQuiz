<template>
<ul class="pagination">
    <li v-for="n in total" :class="{'page-item': true, 'active': n == current+1}">
        <a href="#">{{ n }}</a>
    </li>
</ul>
</template>

<script>
export default {
    props: ["total", "current"]
}
</script>
