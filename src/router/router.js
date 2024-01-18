import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage'
import ResultPage from '@/pages/ResultPage'

const routes = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/getResult',
    component: ResultPage
  }
]
const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL)
})

export default router;