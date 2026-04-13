import { LoadType, Section } from '@renderer/types'
import { countByType, getStatusByLower, powerByType } from '@renderer/utils'
import { PhaseLines } from './PhaseLines'
import { LoadInfo } from './LoadInfo'
import { LOAD_STYLES } from '@renderer/constants/loadStyles'
import { UminAllow } from '@renderer/constants'
import { statusCls } from '@renderer/assets/common'

interface SchemaNodeProps {
  section: Section | null // null = source node
  nextSection?: Section
  isActive: boolean
  onClick?: () => void
}

export function SchemaNode({ section, nextSection, isActive, onClick }: SchemaNodeProps) {
  const isSource = section === null
  const loads = section?.loads_kw ?? []
  const houseHoldCount = countByType(loads, LoadType.Household)
  const houseHoldLoads = parseFloat(powerByType(loads, LoadType.Household)).toFixed(1)

  const heatingCount = countByType(loads, LoadType.Heating)
  const heatingLoads = parseFloat(powerByType(loads, LoadType.Heating)).toFixed(1)

  const electricCarCount = countByType(loads, LoadType.ElectricCar)
  const electricCarLoads = parseFloat(powerByType(loads, LoadType.ElectricCar)).toFixed(1)

  const promCount = countByType(loads, LoadType.Prom)
  const promLoads = parseFloat(powerByType(loads, LoadType.Prom)).toFixed(1)

  const UminWarn = UminAllow * 1.05
  const voltageStatus = nextSection
    ? getStatusByLower(nextSection.results.Uend, UminWarn, UminAllow)
    : undefined

  const statusClass = statusCls(voltageStatus)

  return (
    <div className="flex items-end">
      <div className="flex flex-col items-center relative">
        {!isSource && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none flex flex-col gap-2 leading-tight whitespace-nowrap">
            {houseHoldCount > 0 && (
              <LoadInfo
                loadName={LoadType.Household}
                loadCount={houseHoldCount}
                loadPower={houseHoldLoads}
                textColor={LOAD_STYLES[LoadType.Household].text}
              />
            )}
            {heatingCount > 0 && (
              <LoadInfo
                loadName={LoadType.Heating}
                loadCount={heatingCount}
                loadPower={heatingLoads}
                textColor={LOAD_STYLES[LoadType.Heating].text}
              />
            )}
            {electricCarCount > 0 && (
              <LoadInfo
                loadName={LoadType.ElectricCar}
                loadCount={electricCarCount}
                loadPower={electricCarLoads}
                textColor={LOAD_STYLES[LoadType.ElectricCar].text}
              />
            )}
            {promCount > 0 && (
              <LoadInfo
                loadName={LoadType.Prom}
                loadCount={promCount}
                loadPower={promLoads}
                textColor={LOAD_STYLES[LoadType.Prom].text}
              />
            )}
          </div>
        )}
        <div
          onClick={onClick}
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all
          ${
            isSource
              ? 'border-(--color-secondary) text-(--color-active) cursor-default'
              : isActive
                ? 'border-(--color-active) bg-[#dfbc2422] text-(--color-active) cursor-pointer scale-110'
                : 'border-[#30363d] text-(--text) hover:border-(--status-default) cursor-pointer'
          }`}
        >
          {isSource ? '⚡' : section!.poleNumber}
        </div>
      </div>

      {nextSection && (
        <div className="flex flex-col items-center mb-3">
          <div className="w-full flex justify-end gap-4 px-2 whitespace-nowrap">
            <span className="text-[10px] text-(--text) mb-1">{nextSection.wire}</span>
            <span className="text-[10px] text-(--status-default) mb-1">
              {nextSection.length_m || '0'}м
            </span>
            <span className={`text-[10px] mb-1 ${statusClass}`}>{nextSection.results.Uend} В</span>
          </div>
          <PhaseLines phases={nextSection.phases} />
        </div>
      )}
    </div>
  )
}
