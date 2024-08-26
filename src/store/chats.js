import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"

export const useChats = defineStore("chats", {
    state: () => ({
        chats: null,
    }),
    actions: {
        getChats() { // { per_page, page, search, sort_field, sort_direction }
            // let query = `page=${page}&per_page=${per_page}&sort_field=${sort_field}&sort_direction=${sort_direction}`
            // if (search) query += '&search=' + search

            // return useRequest(`chats?${query}`)
            return useRequest(`chats`)
        },
        getChat(id) {
            return useRequest(`chats/${id}`)
        },
        initChat({ to_id }) {
            return useRequest('chats/init', {
                method: 'POST',
                body: { to_id }
            })
        },
    }
})