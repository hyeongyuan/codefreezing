import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true

const client: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export const apiGet = (url: string, config?: AxiosRequestConfig) =>
  client({ ...config, url, method: 'GET' })
export const apiPost = (url: string, data?: any, config?: AxiosRequestConfig) =>
  client({ ...config, url, data, method: 'POST' })

export const registerAccessToken = (accessToken: string) => {
  client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
}

export const revokeAccessToken = () => {
  client.defaults.headers.common['Authorization'] = ''
}
