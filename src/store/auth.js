import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useAuth = defineStore("auth", {
    state: () => ({
        me: null,
    }),
    // getters: {
    //     getUserRole: (state) => state.me?.role?.name,
    //     isVerified: (state) => state.me?.status === 'verified'
    // },
    actions: {
        async login({ email, password }) {
            await useRequest('auth/login', {
                method: 'POST',
                body: { email, password }
            })
                .then((data) => {
                    if (data.token) localStorage.setItem('token', data.token)
                })
        },
        async signUp(body) {
            await useRequest('auth/sign-up', {
                method: 'POST',
                body
            })
                .then((data) => {
                    if (data.message) toast(data.message, {
                        theme: "colored",
                        type: "success",
                        position: "top-center",
                        transition: "slide",
                        dangerouslyHTMLString: true,
                    });
                })
        }
        // login({ email, password }) {
        //     return useRequest("/auth/login", {
        //         method: "POST",
        //         body: { email: email?.toLowerCase(), password },
        //     }).then((response) => {
        //         console.log('response', response)
        //         // const responseData = response.data;
        //         // const { token_type = "", access_token = "" } = responseData;
        //         // this.setToken(`${token_type} ${access_token}`, rememberMe);

        //         return response;
        //     });
        // },
    },
});
