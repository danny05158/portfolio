import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import App from '/src/vue/stack/App.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/about' },
  { path: '/about',     name: 'about',     component: App },
  { path: '/education', name: 'education', component: App },
  { path: '/skills',    name: 'skills',    component: App },
  { path: '/:pathMatch(.*)*', redirect: '/about' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
