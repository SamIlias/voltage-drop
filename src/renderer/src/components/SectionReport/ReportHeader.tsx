import { Unom220 } from '@renderer/constants'
import { MetaItem } from './MetaItem'
import { ReportMeta } from './ReportContent'
import { fmt } from './utils'
import { LoadType } from '@renderer/types'

const baseBlockInput = `border border-zinc-200 rounded-b-md overflow-hidden`

export function ReportHeader({ meta }: { meta: ReportMeta }) {
  return (
    <div className="flex gap-4 m-2">
      <div className="">
        <SectionLabel>Трансформатор</SectionLabel>
        <div className={`flex flex-col ${baseBlockInput}`}>
          <MetaItem label="Мощность" value={meta.transformerPower_kva} unit="кВА" />
          <MetaItem label="Схема обмоток" value={meta.transformerScheme} />
          <MetaItem label="Загрузка" value={fmt(meta.transformerLoad)} unit="%" />
        </div>
      </div>

      <div className="">
        <SectionLabel>Линия</SectionLabel>
        <div className={`flex gap-1 ${baseBlockInput}`}>
          <div>
            <MetaItem label="Ток 1 фазы" value={fmt(meta.fullWorkCurrent)} unit="А" />
            <MetaItem label="cos φ" value={meta.cosPhi} />
            <MetaItem label="Длина" value={fmt(meta.fullLength)} unit="м" />
          </div>
          <div className="flex flex-col justify-center">
            <MetaItem label="Потери, ΔU" value={fmt(meta.voltageDrop_v)} unit="В" />
            <MetaItem
              label="Потери, ΔU%"
              value={fmt(meta.voltageDrop_v ? (meta.voltageDrop_v / Unom220) * 100 : null)}
              unit="%"
            />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <SectionLabel>Нагрузки</SectionLabel>
        <div className={`flex gap-2 justify-around ${baseBlockInput}`}>
          <div>
            <MetaItem label="NΣ" value={meta.loadSummary.totalCount} unit="шт" />
            <MetaItem label="PΣ" value={fmt(meta.loadSummary.totalPower)} unit="кВт" />
          </div>

          <div>
            <MetaItem
              label={`N${LoadType.Household}`}
              value={meta.loadSummary.household.count}
              unit="шт"
            />
            <MetaItem
              label={`P${LoadType.Household}`}
              value={fmt(meta.loadSummary.household.power)}
              unit="кВт"
            />
            <MetaItem
              label={`K${LoadType.Household}`}
              value={meta.loadSummary.household.ksim}
              unit="шт"
            />
          </div>

          <div>
            <MetaItem
              label={`N${LoadType.Heating}`}
              value={meta.loadSummary.heating.count}
              unit="шт"
            />
            <MetaItem
              label={`P${LoadType.Heating}`}
              value={fmt(meta.loadSummary.heating.power)}
              unit="кВт"
            />
            <MetaItem
              label={`K${LoadType.Heating}`}
              value={meta.loadSummary.heating.ksim}
              unit="шт"
            />
          </div>

          <div>
            <MetaItem
              label={`N${LoadType.ElectricCar}`}
              value={meta.loadSummary.electricCar.count}
              unit="шт"
            />
            <MetaItem
              label={`P${LoadType.ElectricCar}`}
              value={fmt(meta.loadSummary.electricCar.power)}
              unit="кВт"
            />
            <MetaItem
              label={`K${LoadType.ElectricCar}`}
              value={meta.loadSummary.electricCar.ksim}
              unit="шт"
            />
          </div>
          <div>
            <MetaItem label={`N${LoadType.Prom}`} value={meta.loadSummary.prom.count} unit="шт" />
            <MetaItem
              label={`P${LoadType.Prom}`}
              value={fmt(meta.loadSummary.prom.power)}
              unit="кВт"
            />
            <MetaItem label={`K${LoadType.Prom}`} value={meta.loadSummary.prom.ksim} unit="шт" />
          </div>
        </div>
      </div>

      <div className="">
        <SectionLabel>Токи КЗ</SectionLabel>
        <div className={`flex flex-col ${baseBlockInput}`}>
          <MetaItem label="3-фазное КЗ" value={fmt(meta.IkzSummary.Ikz3)} unit="А" />
          <MetaItem label="2-фазное КЗ" value={fmt(meta.IkzSummary.Ikz2)} unit="А" />
          <MetaItem label="1-фазное КЗ" value={fmt(meta.IkzSummary.Ikz1)} unit="А" />
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.12em] text-zinc-900 px-3 py-1.5 bg-zinc-200 border border-b-0 border-zinc-200 rounded-t-md">
      {children}
    </p>
  )
}
