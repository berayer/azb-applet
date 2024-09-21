const BASE_CONN_URL = import.meta.env.VITE_WEBSOCKET_SERVER

type SocketMsg<T = any> = {
  action: 'scanQRCode',
  data?: T
}

export function useWebSocket(openId: string, callback: (data: string) => void) {
  let ws: WebSocket | null;
  function connect() {
    ws = new WebSocket(BASE_CONN_URL + "/" + openId + ":KJL")
    ws.onmessage = (e) => {
      const response = JSON.parse(e.data) as SocketMsg
      callback(response.data || '')
    }
  }
  function isReady() {
    if (!ws) return false
    return ws.readyState === 1
  }
  function sendRequest(request: SocketMsg) {
    if (isReady()) {
      ws?.send(JSON.stringify(request))
    } else {
      ws = null;
      connect()
    }
  }
  function scanQRCode() {
    sendRequest({
      action: 'scanQRCode'
    })
  }
  return { scanQRCode }
}

