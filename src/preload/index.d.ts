import { ElectronAPI } from '@electron-toolkit/preload'

interface api {
  saveSections: (sections: unknown, fileName: string) => Promise<void>
  loadSections: () => Promise<unknown>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: api
  }
}
