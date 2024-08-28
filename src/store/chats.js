import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"

export const useChats = defineStore("chats", {
    state: () => ({
        chat: null,
    }),
    actions: {
        initChat({ to_id }) {
            return useRequest('chats/init', {
                method: 'POST',
                body: { to_id }
            })
        },
        getChats() { // { per_page, page, search, sort_field, sort_direction }
            // let query = `page=${page}&per_page=${per_page}&sort_field=${sort_field}&sort_direction=${sort_direction}`
            // if (search) query += '&search=' + search

            // return useRequest(`chats?${query}`)
            return useRequest(`chats`)
        },
        getChat(id) {
            return useRequest(`chats/${id}`).then((data) => {
                this.chat = data;
                return data;
            });
        },
        sendMessage({ message }) {
            return useRequest(`chats/${this.chat._id}/messages`, {
                method: 'POST',
                body: { message }
            })
        }
    }
})