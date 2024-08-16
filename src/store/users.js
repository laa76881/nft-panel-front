import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"

export const useUsers = defineStore("users", {
    state: () => ({
        users: null,
    }),
    actions: {
        getUsers({ per_page, page }) {
            return useRequest(`users?per_page=${per_page}&page=${page}`)
        },
        getUser(id) {
            return useRequest(`user/${id}`)
        },
    }
})