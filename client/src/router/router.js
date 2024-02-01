import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage'
import ResultPage from '@/pages/ResultPage'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/getResult',
    name: 'result',
    component: ResultPage
  }
]
const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL)
})

export default router;