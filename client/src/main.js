import { createApp } from 'vue'
import App from './App'
import router from '@/router/router'
import '@/assets/scss/global.scss'

const app = createApp(App)
app
  .use(router)
  .mount('#app')
