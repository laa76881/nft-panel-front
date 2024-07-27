
import { createFetch } from '@vueuse/core'
import { useToast } from "@/main"

export const useMyFetch = createFetch({
  // baseUrl: process.env.BASE_URL + '/api',
  baseUrl: 'http://localhost:3000' + '/api', // for tests
  options: {
    async beforeFetch({ options }) {
      const token = localStorage.getItem('token') || ''
      if (token) options.headers.Authorization = `Bearer ${token}`
      options.headers['Content-Type'] = 'application/json'
      return { options }
    },
    onFetchError(ctx) {
      // console.log('onFetchError', ctx, ctx.data)
      ctx.error = new Error(ctx.data)
      return ctx
    }
  },
  fetchOptions: {
    mode: 'cors'
  },
})

export const useRequest = async (url, options) => {
  const { data, error } = options ? await useMyFetch(url).post(options.body) : await useMyFetch(url)
  // console.log('error', error)
  // console.log('data', data)
  if (error.value?.message) {
    setError(error.value?.message)
  } else {
    return JSON.parse(data.value)
  }
}

const setError = (message) => {
  useToast(message, "error")
  throw new Error(message)
}