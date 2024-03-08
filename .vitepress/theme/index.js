// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import Home from './Home.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout:Home,
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   })
  // },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
