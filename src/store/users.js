import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"

export const useUsers = defineStore("users", {
    state: () => ({
        users: null,
    }),
    actions: {
        getUsers() {
            return useRequest('users')
        },
        getUser(id) {
            return useRequest(`user/${id}`)
        },
    }
})