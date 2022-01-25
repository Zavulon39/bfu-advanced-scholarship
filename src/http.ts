import axios, { AxiosError } from 'axios'

const $api = axios.create({
  withCredentials: true,
})

$api.interceptors.request.use(config => {
  config.headers!.Authorization = `Bearer ${localStorage.getItem('access')}`
  config.headers!['X-CSRFToken'] = getCookie('csrftoken')

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
        const resp = await axios.post(
          '/api/auth/refresh/',
          {
            refresh_token: localStorage.getItem('refresh'),
          },
          {
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )

        localStorage.setItem('access', resp.data['access_token'])
        localStorage.setItem('refresh', resp.data['refresh_token'])

        return $api.request(originalRequest)
      } catch (e) {
        M.toast({
          html: `<span>Вы не авторизованны!</span>`,
        })
      }
    }
    M.toast({
      html: `<span>Что-то пошло не так: <b>${error.response?.data.detail}</b></span>`,
      classes: 'red darken-4',
    })

    throw error
  }
)

function getCookie(name: string) {
  var cookieValue = null
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue!
}

export default $api
