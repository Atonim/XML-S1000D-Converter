import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage'
import ResultPage from '@/pages/ResultPage'

const routes = [
  {
    path: '/',
    name: 'main-page',
    component: MainPage
  },
  {
    path: '/getResult',
    name: 'result-page',
    component: ResultPage
  }
]
const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL)
})

export default router;