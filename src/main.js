import App from "./App.vue";
import "@/assets/scss/index.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index.js";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#root");
