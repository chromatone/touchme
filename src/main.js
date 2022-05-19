import { createApp } from "vue";
import App from "./app.vue";


import './styles/index.css'
import 'floating-vue/dist/style.css'
import "virtual:windi.css";

import { createRouter, createWebHashHistory } from "vue-router";
import FloatingVue from 'floating-vue'

import routes from "~pages";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

const app = createApp(App);
app.use(router)
app.use(FloatingVue)

setTimeout(() => {
  app.mount("#touchme-app");
}, 500)
