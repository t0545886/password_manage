import { createApp } from 'vue';
import App from './App.vue';
import { loadFonts } from './plugins/webfontloader';
import '@mdi/font/css/materialdesignicons.css';
import axios from 'axios';
import { createVuetify } from 'vuetify/lib/framework';
import 'vuetify/styles';  // 正確導入 Vuetify 的樣式

loadFonts();

const vuetify = createVuetify({
  // 在這裡你可以設定 Vuetify 的各種選項
});

const app = createApp(App);

app.config.globalProperties.$http = axios;  // 這樣在組件內可以通過 this.$http 訪問 axios
app.use(vuetify);
app.mount('#app');
