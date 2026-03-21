import { LoadType, Section } from '@renderer/types'
import { countByType, powerByType } from '@renderer/utils'
import { PhaseLines } from './PhaseLines'
import { LoadInfo } from './LoadInfo'
import { LOAD_STYLES } from '@renderer/constants/loadStyles'

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

  return (
    <div className="flex items-end">
      <div className="flex flex-col items-center">
        <div className="relative flex flex-col items-center mb-1 justify-end">
          {!isSource && (
            <div className="absolute -translate-x-1/2 whitespace-nowrap left-1/2 flex flex-col gap-2 leading-tight mb-2 pointer-events-none">
              {houseHoldCount ? (
                <LoadInfo
                  loadName={LoadType.Household}
                  loadCount={houseHoldCount}
                  loadPower={houseHoldLoads}
                  textColor={LOAD_STYLES[LoadType.Household].text}
                />
              ) : null}

              {heatingCount ? (
                <LoadInfo
                  loadName={LoadType.Heating}
                  loadCount={heatingCount}
                  loadPower={heatingLoads}
                  textColor={LOAD_STYLES[LoadType.Heating].text}
                />
              ) : null}

              {electricCarCount ? (
                <LoadInfo
                  loadName={LoadType.ElectricCar}
                  loadCount={electricCarCount}
                  loadPower={electricCarLoads}
                  textColor={LOAD_STYLES[LoadType.ElectricCar].text}
                />
              ) : null}

              {promCount ? (
                <LoadInfo
                  loadName={LoadType.Prom}
                  loadCount={promCount}
                  loadPower={promLoads}
                  textColor={LOAD_STYLES[LoadType.Prom].text}
                />
              ) : null}
            </div>
          )}
        </div>
        <div
          onClick={onClick}
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all
          ${
            isSource
              ? 'border-[#58a6ff] text-[#58a6ff] cursor-default'
              : isActive
                ? 'border-[#58a6ff] bg-[#58a6ff22] text-[#c59120] cursor-pointer scale-110'
                : 'border-[#30363d] text-[#8b949e] hover:border-[#58a6ff44] cursor-pointer'
          }`}
        >
          {isSource ? '⚡' : section!.poleNumber}
        </div>
      </div>
      {nextSection && (
        <div className="flex flex-col items-center mx-1 mb-3">
          <span className="text-[12px] text-[#8b949e] mb-1">{nextSection.wire}</span>
          <PhaseLines phases={nextSection.phases} />
        </div>
      )}
    </div>
  )
}
