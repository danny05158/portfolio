import "./scss/style.scss"
import {createApp} from "vue"
import { createPinia } from 'pinia'
import router from '/src/router/index.js'
import App from "/src/vue/stack/App.vue"

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount("#app")

