import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  saveData: (data: unknown, fileName?: string) => ipcRenderer.invoke('data:save', data, fileName),
  loadData: () => ipcRenderer.invoke('data:load'),
  printHtml: (html: string) => ipcRenderer.invoke('print:html', html),
  savePdf: (html: string, fileName: string) => ipcRenderer.invoke('save:pdf', html, fileName),

  onBeforeClose: (callback: () => void) => {
    ipcRenderer.on('app:before-close', callback)
    return () => ipcRenderer.removeListener('app:before-close', callback)
  },
  confirmClose: () => ipcRenderer.invoke('app:confirm-close'),
  cancelClose: () => ipcRenderer.invoke('app:cancel-close')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
