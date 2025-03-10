import '@/assets/scss/global.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate';

import App from './App.vue'
import router from './router'
import i18n from "@/common/i18n"

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')
