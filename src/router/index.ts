import { createRouter, createWebHistory } from 'vue-router'
import GenView from "../views/GenView.vue";
import ExeView from "../views/ExeView.vue";
import Login from '@/components/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/api/login'
    },
    {
      path: '/api/login', // 登录页面
      name: 'login',
      component: Login,
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
