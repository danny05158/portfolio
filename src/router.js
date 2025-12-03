import { createMemoryHistory, createRouter } from 'vue-router'

import Home from './views/Home.vue'
import About from './views/About.vue'
import Skills from './views/Skills.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/skills', component: Skills}
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
