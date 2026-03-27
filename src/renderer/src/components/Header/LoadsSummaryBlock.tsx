import { LOAD_STYLES } from '@renderer/constants/loadStyles'
import { FieldLabel } from '../FieldLabel'
import { LoadType } from '@renderer/types'
import { LoadSummary } from '@renderer/utils/electricCalc'

export function LoadsSummaryBlock({ loadSummary }: { loadSummary: LoadSummary }) {
  return (
    <FieldLabel text="Сводная информация" addClsName="items-center">
      <div className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1 my-1 text-xs text-gray-300 whitespace-nowrap">
        <span
          className={LOAD_STYLES[LoadType.Household].text}
        >{`N${LoadType.Household} = ${loadSummary.household.count}`}</span>
        <span
          className={LOAD_STYLES[LoadType.Household].text}
        >{`P${LoadType.Household} = ${loadSummary.household.power.toFixed(2)} кВт`}</span>
        <span
          className={LOAD_STYLES[LoadType.Heating].text}
        >{`N${LoadType.Heating} = ${loadSummary.heating.count}`}</span>
        <span
          className={LOAD_STYLES[LoadType.Heating].text}
        >{`P${LoadType.Heating} = ${loadSummary.heating.power.toFixed(2)} кВт`}</span>
        <span
          className={LOAD_STYLES[LoadType.ElectricCar].text}
        >{`N${LoadType.ElectricCar} = ${loadSummary.electricCar.count}`}</span>
        <span
          className={LOAD_STYLES[LoadType.ElectricCar].text}
        >{`P${LoadType.ElectricCar} = ${loadSummary.electricCar.power.toFixed(2)} кВт`}</span>
        <span
          className={LOAD_STYLES[LoadType.Prom].text}
        >{`N${LoadType.Prom} = ${loadSummary.prom.count}`}</span>
        <span
          className={LOAD_STYLES[LoadType.Prom].text}
        >{`P${LoadType.Prom} = ${loadSummary.prom.power.toFixed(2)} кВт`}</span>
        <span className="font-bold text-xs">{`NΣ = ${loadSummary.totalCount}`}</span>
        <span className="font-bold text-xs">{`PΣ = ${loadSummary.totalPower.toFixed(2)} кВт`}</span>
      </div>
    </FieldLabel>
  )
}
