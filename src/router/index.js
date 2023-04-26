import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/ptp/csgo'
  },
  {
    path: '/ptp/csgo',
    name: 'csgo选品',
    component: () => import(/* webpackChunkName: "about" */ '../views/ptp/csgo/index.vue'),
    meta: {
      title: 'csgo选品'
    }
  }
]

const router = createRouter({
  base: '/',
  history: createWebHashHistory(),
  routes
})

export default router
