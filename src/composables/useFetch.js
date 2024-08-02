
import { createFetch } from '@vueuse/core'
import { useToast } from "@/main"
import router from "@/router/index.js";
import { useAuth } from '@/store/auth'

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
      ctx.error = {
        message: ctx.data ? ctx.data : 'Server error',
        status: ctx.response?.status
      }
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
  if (error.value) {
    setError(error.value)
  } else {
    return JSON.parse(data.value)
  }
}

const setError = ({ message, status }) => {
  if (status === 401) {
    const authStore = useAuth()
    authStore.logOut()
    router.push({ name: 'login' })
  }

  setTimeout(() => {
    useToast(status === 404 ? 'Not found' : message, "error")
  }, 250)
  throw new Error(message)
}