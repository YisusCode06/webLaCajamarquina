import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import Users from '@/components/dashboard/users/User.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import Tables from '@/components/dashboard/tables/Tables.vue'
import Menu from '@/components/dashboard/menu/Menu.vue'
import Orders from '@/components/dashboard/orders/Orders.vue'
import Reports from '@/components/dashboard/reports/Reports.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      children: [
        {
          path: '',
          component: Dashboard,
        },
        {
          path: 'users',
          component: Users,
        },
        {
          path: 'tables',
          component: Tables,
        },
        {
          path:'menu',
          component: Menu,
        },
        {
          path: 'orders',
          component: Orders,
        },
        {
          path:'reports',
          component: Reports,
        }
      ]
    }
  ]
})

export default router
