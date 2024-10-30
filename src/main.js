import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './registerServiceWorker'
import router from "./router";
import { i18n } from "./plugins/i18n";
// import VueFormGenerator from 'vue-form-generator';
import Vue3FormGenerator from 'vue3-form-generator';
import '@mdi/font/css/materialdesignicons.css';
import '@fortawesome/fontawesome-free/css/all.css';
require('./assets/css/styles.css');
import VueForm from '@vueform/vueform';
import vueformConfig from './plugins/vueform.config.js';


const app = createApp(App)
app.use(vuetify)
app.use(router)
app.use(i18n)
app.use(VueForm, vueformConfig)
app.use(Vue3FormGenerator);
app.mount('#app')
