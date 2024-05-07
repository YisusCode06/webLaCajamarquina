import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import Users from '@/components/dashboard/users/User.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'

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
        }
      ]
    }
  ]
})

export default router
