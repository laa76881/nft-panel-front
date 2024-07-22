
import { createFetch } from '@vueuse/core'

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useMyFetch = createFetch({
  baseUrl: 'http://localhost:3000/api',
  options: {
    async beforeFetch({ options }) {
      const token = localStorage.getItem('token') || ''
      if (token) options.headers.Authorization = `Bearer ${token}`
      options.headers['Content-Type'] = 'application/json'
      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors'
  },
})

export const useRequest = async (url, options) => {
  const { data, error } = options ? await useMyFetch(url).post(options.body) : await useMyFetch(url)
  if (error.value) setError(error.value)
  return JSON.parse(data.value)
}

const setError = (message) => {
  toast(message, {
    theme: "colored",
    type: "error",
    position: "top-center",
    transition: "slide",
    dangerouslyHTMLString: true,
  });
  throw new Error(message)
}