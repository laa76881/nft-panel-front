import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"
// import router from "@/router/index"

export const useProfile = defineStore("profile", {
    state: () => ({
        // me: null,
    }),
    // getters: {
    //     getUserRole: (state) => state.me?.role?.name,
    //     isVerified: (state) => state.me?.status === 'verified'
    // },
    actions: {
        save({ id, first_name, last_name }) {
            return useRequest('profile', {
                method: 'POST',
                body: { id, first_name, last_name }
            })
        },
        updatePassword({ id, current_password, password, password_confirmation }) {
            return useRequest('profile/password', {
                method: 'POST',
                body: { id, current_password, password, password_confirmation }
            })
        },
        updateAvatar(formData) {
            return useRequest('profile/avatar', {
                method: 'POST',
                body: formData
            })
        },
        removeAvatar() {
            return useRequest('profile/avatar', {
                method: 'POST',
                body: {}
            })
        }
    },
});
