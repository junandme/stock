import Vue from 'vue'
import Router from 'vue-router'
import Stock from '@/components/Stock'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Stock',
      component: Stock
    }
  ]
})
