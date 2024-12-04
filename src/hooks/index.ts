export function useWebSocket(uid: string, callback: (data: string) => void) {
  const wb = new WebSocket(`wss://58.248.30.148:9527/v2/api/websocket/${uid}`)

  console.log('websocketlaod', uid)

  wb.onmessage = (e) => {
    const response = e.data as string
    callback(response)
  }

  wb.onerror = (e) => {
    console.log(e)
  }

  function sendRequest(request: string = '') {
    wb.send(JSON.stringify(request))
  }

  function canUse() {
    console.log(wb.readyState)
    return wb.readyState === 1
  }

  return {
    sendRequest,
    canUse,
  }
}
