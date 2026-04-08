import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import * as fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('print:html', async (_event, html: string) => {
    try {
      printHtml(html)
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  })

  ipcMain.handle('save:pdf', async (_, html: string, fileName = 'Новый расчёт') => {
    const win = new BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: true
      }
    })

    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true,
      preferCSSPageSize: true
    })

    const { filePath } = await dialog.showSaveDialog({
      title: 'Сохранить PDF',
      defaultPath: `${fileName}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    })

    if (filePath) {
      fs.writeFileSync(filePath, pdfBuffer)
    }

    win.close()
  })

  ipcMain.handle('sections:save', async (_event, sections, fileName = 'Новый расчёт') => {
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: 'Сохранить расчёт',
      defaultPath: `${fileName}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }]
    })
    if (canceled || !filePath) return { success: false }
    try {
      fs.writeFileSync(filePath, JSON.stringify(sections, null, 2), 'utf-8')
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  })

  ipcMain.handle('sections:load', async () => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
      title: 'Загрузить расчёт',
      filters: [{ name: 'JSON', extensions: ['json'] }],
      properties: ['openFile']
    })
    if (canceled || !filePaths[0]) return null
    try {
      const data = fs.readFileSync(filePaths[0], 'utf-8')
      return JSON.parse(data)
    } catch {
      return null
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

export function printHtml(html: string) {
  const printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: false,
      sandbox: false
    }
  })

  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

  printWindow.webContents.on('did-finish-load', async () => {
    try {
      printWindow.webContents.print(
        { silent: false, printBackground: true },
        (success, failureReason) => {
          if (!success) console.error('Print failed:', failureReason)
          setTimeout(() => {
            if (!printWindow.isDestroyed()) printWindow.close()
          }, 300)
        }
      )
    } catch (e) {
      console.error('Print error:', e)
      if (!printWindow.isDestroyed()) printWindow.close()
    }
  })
}
