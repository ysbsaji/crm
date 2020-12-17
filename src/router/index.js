import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardPage from '../views/DashboardPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/dashbord',
    name: 'Dashboard',
    component: DashboardPage
  },
  {
    path: '/employeepage',
    name: 'EmployeePage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "EmployeePage" */ '../views/EmployeePage.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "signup" */ '../components/signup.vue')
  },
  {
    path: '/customerpage',
    name: 'CustomerPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "CustomerPage" */ '../views/CustomerPage.vue')
  },
  {
    path: '/orderpage',
    name: 'OrderPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "OrderPage" */ '../views/OrderPage.vue')
  },
  {
    path: '/productpage',
    name: 'ProductPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ProductPage" */ '../views/ProductPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
