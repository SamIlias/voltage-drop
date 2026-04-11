import { ElectronAPI } from '@electron-toolkit/preload'

interface api {
  saveData: (data: unknown, fileName?: string) => Promise<void>
  loadData: () => Promise<unknown>
  printHtml: (html: string) => Promise<void>
  savePdf: (html: string, fileName: string) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: api
  }
}
