import { ElectronAPI } from '@electron-toolkit/preload'

interface api {
  loadTodos: () => Promise<unknown>
  saveTodos: (todos: unknown) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: api
  }
}
