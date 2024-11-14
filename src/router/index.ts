import { createRouter, createWebHistory } from 'vue-router'
import GenView from "../views/GenView.vue";
import ExeView from "../views/ExeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/gen'
    },
    {
      path: '/gen',
      name: 'gen',
      component: GenView,
    },
    {
      path: '/exe',
      name: 'exe',
      component: ExeView,
    }
  ],
})

export default router
