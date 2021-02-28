import Vue from 'vue'
import Router from 'vue-router'
import Stock from '@/components/Stock'
import StockTotal from '@/components/StockTotal'
import StockLog from '@/components/StockLog'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Stock',
      component: Stock,
      children: [
        {
          path: 'total',
          component: StockTotal
        },
        {
          path: 'log',
          component: StockLog
        }
      ]
    }
  ]
})
