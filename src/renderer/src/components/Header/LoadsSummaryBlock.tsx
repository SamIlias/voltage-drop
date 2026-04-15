import { LOAD_STYLES } from '@renderer/constants/loadStyles'
import { LoadType } from '@renderer/types'
import { LoadSummary } from '@renderer/utils/electricCalc'
import { Tooltip } from '../Tooltip'

export function LoadsSummaryBlock({ loadSummary }: { loadSummary: LoadSummary }) {
  return (
    <div className="font-mono">
      <p className="text-center text-sm border-b border-(--color-secondary)">
        Информация о потребителях
      </p>

      <div className="grid grid-cols-[auto_auto] gap-x-5 gap-y-2 my-1 text-xs text-(--text) whitespace-nowrap">
        <span
          className={LOAD_STYLES[LoadType.Household].text}
        >{`N${LoadType.Household} = ${loadSummary.household.count}`}</span>
        <Tooltip content={`Сумма всех P${LoadType.Household}`}>
          <span
            className={LOAD_STYLES[LoadType.Household].text}
          >{`P${LoadType.Household} = ${loadSummary.household.power.toFixed(2)} кВт`}</span>
        </Tooltip>

        <span
          className={LOAD_STYLES[LoadType.Heating].text}
        >{`N${LoadType.Heating} = ${loadSummary.heating.count}`}</span>
        <Tooltip content={`Сумма всех P${LoadType.Heating}`}>
          <span
            className={LOAD_STYLES[LoadType.Heating].text}
          >{`P${LoadType.Heating} = ${loadSummary.heating.power.toFixed(2)} кВт`}</span>
        </Tooltip>

        <span
          className={LOAD_STYLES[LoadType.ElectricCar].text}
        >{`N${LoadType.ElectricCar} = ${loadSummary.electricCar.count}`}</span>
        <Tooltip content={`Сумма всех P${LoadType.ElectricCar}`}>
          <span
            className={LOAD_STYLES[LoadType.ElectricCar].text}
          >{`P${LoadType.ElectricCar} = ${loadSummary.electricCar.power.toFixed(2)} кВт`}</span>
        </Tooltip>

        <span
          className={LOAD_STYLES[LoadType.Prom].text}
        >{`N${LoadType.Prom} = ${loadSummary.prom.count}`}</span>
        <Tooltip content={`Сумма всех P${LoadType.Prom}`}>
          <span
            className={LOAD_STYLES[LoadType.Prom].text}
          >{`P${LoadType.Prom} = ${loadSummary.prom.power.toFixed(2)} кВт`}</span>
        </Tooltip>

        <span className="font-bold text-xs">{`NΣ = ${loadSummary.totalCount}`}</span>
        <Tooltip content="PΣ с учётом всех коэффициентов">
          <span className="font-bold text-xs">{`PΣ = ${loadSummary.totalPower.toFixed(2)} кВт`}</span>
        </Tooltip>
      </div>
    </div>
  )
}
