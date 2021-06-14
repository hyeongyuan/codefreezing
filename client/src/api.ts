import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true

const client: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

const apiSuccessHandler = <T>(response: AxiosResponse<T>) => {
  const { status, data, config } = response
  const { data: requestData = '' } = config
  console.log(
    `##axios_response:${config.method}:${config.url}`,
    status,
    requestData,
    data,
  )
  return data
}

export const api = <T>(
  url: string,
  config = {} as AxiosRequestConfig,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    client({ url, ...config })
      .then((res) => resolve(apiSuccessHandler<T>(res)))
      .catch((err) => reject(err))
  })
}

export const apiGet = <T = any>(url: string) => api<T>(url)
export const apiPost = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
) => api<T>(url, { method: 'post', data, ...config })
export const apiDelete = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
) => api<T>(url, { method: 'delete', data, ...config })

export const registerAccessToken = (accessToken: string) => {
  client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
}

export const revokeAccessToken = () => {
  client.defaults.headers.common['Authorization'] = ''
}
