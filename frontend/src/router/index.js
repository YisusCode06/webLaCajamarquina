import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import Users from '@/components/dashboard/users/User.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import Tables from '@/components/dashboard/tables/Tables.vue'
import Menu from '@/components/dashboard/menu/Menu.vue'
import Orders from '@/components/dashboard/orders/Orders.vue'
import Reports from '@/components/dashboard/reports/Reports.vue'
import Profile from '@/components/dashboard/profile/Profile.vue'
import ListOrders from '@/components/dashboard/orders/list-orders/ListOrders.vue'
import AsignOrder from '@/components/dashboard/orders/asign-order/AsignOrder.vue'
import EditOrder from '@/components/dashboard/orders/edit-order/EditOrder.vue'

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
          path: 'menu',
          component: Menu,
        },
        {
          path: 'orders',
          component: Orders,
        },
        {
          path: 'reports',
          component: Reports,
        },
        {
          path: 'profile',
          component: Profile,
        },
        {
          path: 'list-orders',
          component: ListOrders
        },
        {
          path: 'asign-order/:number',
          component: AsignOrder,
          props: true
        },
        {
          path: 'edit-order/:_id',
          component: EditOrder,
          props: true
        }
      ]
    }
  ]
})

export default router
