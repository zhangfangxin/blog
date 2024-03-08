<script setup>
import lottie from "lottie-web";
import { ref, onMounted } from "vue"
const dom = ref()
onMounted(() => {
    lottie.loadAnimation({
        container: dom.value, // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: "/home.json"
    });
})
</script>
<template>
    <div ref="dom"></div>
</template>