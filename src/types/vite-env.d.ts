/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后台api接口地址 */
  readonly VITE_API_SERVER: string
  /** websocket 服务地址 */
  readonly VITE_WEBSOCKET_SERVER: string
  /** 当前应用的版本 */
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
