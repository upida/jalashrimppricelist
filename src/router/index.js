import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'latestpricelist',
      component: () => import('../views/LatestPricelist.vue')
    },
    {
      path: '/:id',
      name: 'detailpricelist',
      component: () => import('../views/DetailPricelist.vue')
    }
  ]
})

export default router
