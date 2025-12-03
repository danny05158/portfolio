import "./scss/style.scss"
import {createApp} from "vue"
import App from './App.vue'
import { router } from "./router"
console.log(router)

// import App from "/src/vue/stack/App.vue"
const app = createApp(App)
app.use(router)
app.mount("#app")
