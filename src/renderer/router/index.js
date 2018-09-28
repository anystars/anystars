import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: require('@/pages/index/Index').default
    },
    {
      path: '/auth',
      name: 'auth-page',
      component: require('@/pages/auth/AuthPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
