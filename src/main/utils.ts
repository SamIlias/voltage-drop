import { BrowserWindow, dialog } from 'electron'
import fs from 'fs'

export function printHtml(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: false,
        sandbox: false
      }
    })

    const cleanup = () => {
      if (!printWindow.isDestroyed()) printWindow.close()
    }

    printWindow.webContents.on('did-fail-load', (_e, code, desc) => {
      cleanup()
      reject(new Error(`Load failed: ${desc} (${code})`))
    })

    printWindow.webContents.on('did-finish-load', () => {
      printWindow.webContents.print(
        { silent: false, printBackground: true },
        (success, failureReason) => {
          cleanup()
          if (success) resolve()
          else reject(new Error(failureReason))
        }
      )
    })

    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
  })
}

export async function savePdf(
  html: string,
  fileName = 'Новый расчёт'
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: true
    }
  })

  try {
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
      await fs.promises.writeFile(filePath, pdfBuffer)
      return { success: true, filePath }
    }

    return { success: false, error: 'Отменено пользователем' }
  } catch (err) {
    return { success: false, error: String(err) }
  } finally {
    if (!win.isDestroyed()) win.close()
  }
}
