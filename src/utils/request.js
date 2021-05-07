import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
import { getDevice } from '@/utils/device'
import { createSign } from '@/utils/ctsign'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 300 * 1000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  this.loading = true
  let json_params = {}
  try {
    if (config.method === 'get') {
        if (config.params !== null && config.params !== undefined) {
          json_params = config.params
        }

        const DEVICE = getDevice()
        if (DEVICE !=='' && DEVICE !== null && DEVICE !== undefined) {
          json_params.device = DEVICE // 让每个请求携带设备号device 请根据实际情况自行修改
        }
        if (store.getters.token) {
          json_params.token = getToken()  // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        
        json_params.timestamp = new Date().getTime()  // 让每个请求携带timestamp
        json_params.sign = createSign(json_params)  // 让每个请求携带sign

        config.params = json_params
    } else if (Object.prototype.toString.call(config.data) !== '[object FormData]') {
      if (config.data !== null && config.data !== undefined) {
        json_params = config.data
      }

      const DEVICE = getDevice()
      if (DEVICE !=='' && DEVICE !== null && DEVICE !== undefined) {
        json_params.device = DEVICE // 让每个请求携带设备号device 请根据实际情况自行修改
      }

      if (store.getters.token) {
        json_params.token = getToken()  // 让每个请求携带自定义token 请根据实际情况自行修改
      }

      json_params.timestamp = new Date().getTime()  // 让每个请求携带timestamp
      json_params.sign = createSign(json_params)  // 让每个请求携带sign

      // 表单提交修改数据格式
      if (config.headers['Content-Type'] == "application/x-www-form-urlencoded") {

        config.data = qs.stringify(json_params)
      } else {
        config.data = json_params
      }
    }

    return config
  } finally {
    this.loading = false
  }
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
    * code为非200是抛错 可结合自己业务进行修改
    */
    const res = response.data
    if (res.code !== 1) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      })

      // 401:未登录
      if (res.code === 401) {
        MessageBox.confirm('登录失效,请重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
