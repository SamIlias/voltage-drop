import { ElectronAPI } from '@electron-toolkit/preload'

interface api {
  loadTodos: () => Promise<unknown>
  saveTodos: (todos: unknown) => Promise<void>
  saveSections: (sections: unknown) => Promise<void>
  loadSections: () => Promise<unknown>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: api
  }
}
