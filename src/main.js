import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './registerServiceWorker'
import router from "./router";
import { i18n } from "./plugins/i18n";

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.use(i18n)
app.mount('#app')
