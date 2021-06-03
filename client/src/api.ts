import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const client: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export const apiGet = (url: string, config?: AxiosRequestConfig) =>
  client({ ...config, url, method: 'GET' })
export const apiPost = (url: string, data?: any, config?: AxiosRequestConfig) =>
  client({ ...config, url, data, method: 'POST' })
