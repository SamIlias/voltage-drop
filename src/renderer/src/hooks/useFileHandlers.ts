import { isSavedData, SavedData, Section } from '@renderer/types'
import { AppSettings } from './useAppSettings'

export function useFileHandlers(
  computedSections: Section[],
  pushHistory,
  setError: (v: Error | null) => void,
  setIsLoading: (v: boolean) => void,
  appSettings: AppSettings
) {
  const handleSave = async () => {
    try {
      setIsLoading(true)

      const payload: SavedData = {
        version: 1,
        sections: computedSections,
        meta: {
          lineName: appSettings.lineName,
          calcDate: appSettings.calcDate,
          cosPhi: appSettings.cosPhi,
          dUallowPercent: appSettings.dUallowPercent,
          useKsim: appSettings.useKsim,
          transformerPower: appSettings.transformerPower,
          transformerScheme: appSettings.transformerScheme,
          poleForCalcReserve: appSettings.poleForCalcReserve,
          k_heatDec: appSettings.k_heatDec
        }
      }

      await window.api.saveData(payload, appSettings.lineName || 'Новый расчёт')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoad = async () => {
    setIsLoading(true)

    try {
      const data = await window.api.loadData()

      if (!data) return

      if (isSavedData(data)) {
        pushHistory(data.sections)

        const m = data.meta

        appSettings.setLineName(m.lineName)
        appSettings.setCalcDate(m.calcDate)
        appSettings.setCosPhiStr(m.cosPhi)
        appSettings.setDUallow(m.dUallowPercent)
        appSettings.setUseKsim(m.useKsim)
        appSettings.setTransformerPower(m.transformerPower)
        appSettings.setTransformerScheme(m.transformerScheme)
        appSettings.setPoleForCalcReserve(m.poleForCalcReserve)
        appSettings.setK_heatDec(m.k_heatDec)

        return
      }

      setError(new Error('Файл повреждён или имеет неверный формат'))
    } catch {
      setError(new Error('Ошибка при загрузке файла'))
    } finally {
      setIsLoading(false)
    }
  }

  return { handleLoad, handleSave }
}
