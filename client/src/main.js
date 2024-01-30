import { createApp } from 'vue'
import App from './App'
import mitt from 'mitt'
import router from '@/router/router'
import '@/assets/scss/global.scss'

const emitter = mitt();
const app = createApp(App);
app.provide('emitter', emitter)
app.use(router).mount('#app')
