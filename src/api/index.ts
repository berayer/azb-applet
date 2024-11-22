import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER,
  timeout: 2000,
})

http.interceptors.request.use((config) => {
  return config
}, () => {
  window.$message.error('网络错误，请稍后再试')
})

http.interceptors.response.use((res) => {
  return res.data
}, () => {
  window.$message.error('网络错误，请稍后再试')
})

/** 通过订单号获取酷家乐方案信息 */
export function fetchDesignInfo(orderNo: string) {
  return http<any, OrderInfo>({
    url: `/orderInfo/${orderNo}`,
  })
}

/** 通过条形码获取板件的酷家乐ID */
export function fetchKjlId(barCode: string) {
  return http<any, BarCodeInfo>({
    url: '/barCode',
    params: { barCode },
  })
}

/** 通过酷家乐ID获取板件信息 */
export function fetchInfo(orderNo: string, kjlId: string) {
  return http<any, BarCodeInfo>({
    url: `/KjlId/${orderNo}`,
    params: { kjlId },
  })
}
