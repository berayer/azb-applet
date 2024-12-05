/**
 * 通过websocket服务转发消息触发微信扫一扫
 * @param uid 微信id
 * @param callback 扫描完成的回调函数
 */
export function useWebSocket(uid: string, callback: (data: string) => void) {
  const wb = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_SERVER}/${uid}`)

  console.log('webSocket建立:', uid)

  wb.onmessage = (e) => {
    const response = e.data as string
    console.log('接受扫一扫消息:', response)
    callback(response)
  }

  wb.onerror = (e) => {
    console.log('webSocket错误:', e)
  }

  function scanQRCode() {
    if (wb.readyState === 1) {
      console.log('发送扫一扫消息')
      wb.send('')
    }
    else {
      console.log('webSocket状态异常:', wb.readyState)
    }
  }

  return { scanQRCode }
}
