import App from "./App.vue";
import "@/assets/scss/index.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router/index.js";

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#root");

export const useToast = (message, type) => {
    toast(message, {
        type,
        theme: "colored",
        position: "top-center",
        transition: "slide",
        dangerouslyHTMLString: true,
    });
}