import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import SearchView from '../views/SearchView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'search',
    component: SearchView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
