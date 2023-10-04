import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import router from './route/index';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@headlessui/vue';
import "primevue/resources/themes/lara-light-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core CSS
import "primeicons/primeicons.css"; //icons

const app = createApp(App);
app.use(PrimeVue, { ripple: true });
app.use(router);

app.mount('#app');
