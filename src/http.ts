import axios, { AxiosError } from 'axios'

const $api = axios.create({
  withCredentials: true,
})

$api.interceptors.request.use(config => {
  config.headers!.Authorization = `Bearer ${localStorage.getItem('access')}`
  return config
})

$api.interceptors.response.use(
  config => config,
  async (error: AxiosError) => {
    const originalRequest = error.config

    // @ts-ignore
    if (error.response?.status === 401 && error.config && !error._isRetry) {
      // @ts-ignore
      originalRequest._isRetry = true

      try {
        const resp = await axios.post('/api/auth/refresh/', {
          refresh_token: localStorage.getItem('refresh'),
        })

        localStorage.setItem('access', resp.data['access_token'])
        localStorage.setItem('refresh', resp.data['refresh_token'])

        return $api.request(originalRequest)
      } catch (e) {
        M.toast({
          html: `<span>Вы не авторизованны!</span>`,
        })
      }
    }

    throw error
  }
)

export default $api
