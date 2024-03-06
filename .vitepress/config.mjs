import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FXBlog",
  description: "卷 都给我卷",
  themeConfig: {
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
