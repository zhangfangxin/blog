import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FXBlog",
  description: "卷 都给我卷",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    logo: "/logo.png",
    search: {
      provider: "local",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "脸面", link: "/" },
      {
        text: "js",
        items: [
          { text: "this", link: "/js/this" },
          { text: "面向对象", link: "/js/oop" },
          { text: "Promise", link: "/js/promise" },
          { text: "模块化", link: "/js/JS_module" },
          { text: "浏览器", link: "/js/browser" },
          { text: "es6", link: "/js/es6" },
        ],
      },
    ],

    sidebar: [
      {
        text: "js",
        items: [
          { text: "this", link: "/js/this" },
          { text: "面向对象", link: "/js/oop" },
          { text: "Promise", link: "/js/promise" },
          { text: "模块化", link: "/js/JS_module" },
          { text: "浏览器", link: "/js/browser" },
          { text: "es6", link: "/js/es6" },
        ],
      },
    ],
    outline: {
      label: "页面导航",
      level: [2, 4],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
