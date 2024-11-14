// src/services/apiClient.ts
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElLoading } from 'element-plus'

// 声明 Loading 实例
let loadingInstance :any

// 创建 axios 实例
const axiosClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8090', // 替换为实际 API 基本 URL
  timeout: 100000 // 请求超时时间
})

// 请求拦截器
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 显示全局加载
    loadingInstance = ElLoading.service({
      lock: true,
      text: '请求中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    return config
  },
  (error) => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    return response
  },
  (error) => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    return Promise.reject(error)
  }
)

export default axiosClient
