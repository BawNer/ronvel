import Vue from 'vue'
import VueRouter from 'vue-router'
import guard from './guard'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: { name: 'Orders' },
    beforeEnter: guard
  },
  {
    path: '/rule',
    name: 'Rule',
    component: () => import('../views/Rule/index.rule.vue'),
    beforeEnter: guard
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('../views/Rule/accounts.rule.vue'),
    beforeEnter: guard
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders/index.orders.vue'),
    beforeEnter: guard
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
