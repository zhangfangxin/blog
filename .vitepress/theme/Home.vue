<script setup>
import DefaultTheme from 'vitepress/theme'
import LottieArea from "./LottieArea.vue"
import { useData } from 'vitepress'

const { Layout } = DefaultTheme

const { frontmatter } = useData()

</script>

<template>
    <Layout>
        <template #home-hero-image>
            <div v-if="frontmatter.layout === 'home'">
                <LottieArea />
            </div>
        </template>
    </Layout>
</template>