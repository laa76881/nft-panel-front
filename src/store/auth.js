import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"
// import { useToast } from "@/main"

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
            return await useRequest('auth/sign-up', {
                method: 'POST',
                body
            })
        },
        async resendLink({email}) {
            console.log('store', email)
            return await useRequest('auth/resend-verification', {
                method: 'POST',
                body: {
                    email
                }
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
