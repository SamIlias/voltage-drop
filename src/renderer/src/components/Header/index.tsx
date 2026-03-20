import { ResultStatus } from '@renderer/types'
import { FieldLabel } from '../FieldLabel'
import { TRANSFORMER_POWERS, TransformerPower } from '@renderer/constants'
import { VDivider } from '../VerticalDivider'
import { getStatusByGreater, getStatusByLower } from '@renderer/utils'
import { ActionButton } from '../ActionButton'
import { Tooltip } from '../Tooltip'
import { ResultBadge } from './ResultBadge'

export type Theme = 'dark' | 'light'

interface HeaderProps {
  // Actions
  handleSave: () => void
  handleUndo: () => void
  handleRedo: () => void
  handleLoad: () => void
  onCreateNewComputation: () => void
  // Inputs
  lineName: string
  setLineName: (v: string) => void
  calcDate: string
  setCalcDate: (v: string) => void
  cosPhi: string
  setCosPhi: (v: string) => void
  transformerPower: string
  setTransformerPower: (v: TransformerPower) => void
  // Results (null = не рассчитано)
  transformerLoad: number | null
  voltageDrop: number | null
  powerReserve: number | null
  lineLength: number | null
  // Theme
  theme: Theme
  onThemeToggle: () => void
}

const inputCls =
  'h-7 px-2 text-[12px] font-mono bg-[#010409] border border-[#30363d] rounded text-[#e6edf3] ' +
  'focus:outline-none focus:border-[#58a6ff] transition-colors'

export function Header({
  handleSave,
  handleUndo,
  handleRedo,
  handleLoad,
  onCreateNewComputation,
  lineName,
  setLineName,
  calcDate,
  setCalcDate,
  cosPhi,
  setCosPhi,
  transformerPower,
  setTransformerPower,
  transformerLoad,
  voltageDrop,
  powerReserve,
  theme,
  onThemeToggle,
  lineLength
}: HeaderProps) {
  const loadStatus = getStatusByGreater(transformerLoad, 70, 90)
  const dropStatus = getStatusByGreater(voltageDrop, 8, 13)
  const reserveStatus = getStatusByLower(powerReserve, 50, 0)

  const onInfoOpen = () => {}

  return (
    <header className="w-full flex items-center gap-4 px-5 border-b border-[#21262d] bg-[#161b22] min-h-17 overflow-x-auto">
      <span className="text-sm font-mono text-[#e6edf3] max-w-50">
        Расчёт параметров линии электропередачи
      </span>

      {/* Menu */}
      <div className="grid grid-cols-2 gap-2 min-w-60 my-1">
        <ActionButton icon="ℹ️" onClick={onInfoOpen}>
          О программе
        </ActionButton>

        <ActionButton icon="📂" onClick={handleLoad}>
          Загрузить
        </ActionButton>

        <ActionButton icon="️📝" onClick={onCreateNewComputation}>
          Новый расчёт
        </ActionButton>

        <ActionButton icon="💾" variant="success" onClick={handleSave}>
          Сохранить
        </ActionButton>
      </div>

      <Tooltip content="Отменить">
        <ActionButton icon="↶" variant="warning" onClick={handleUndo}>
          {''}
        </ActionButton>
      </Tooltip>

      <Tooltip content="Вернуть">
        <ActionButton icon="↷" variant="warning" onClick={handleRedo}>
          {''}
        </ActionButton>
      </Tooltip>

      <VDivider />

      {/* Line name + date */}
      <div className="flex flex-col gap-1 items-start my-2 ">
        <FieldLabel text="Название линии">
          <input
            className={`${inputCls} min-w-50`}
            value={lineName}
            onChange={(e) => setLineName(e.target.value)}
            placeholder="ВЛ 0,4 кВ от КТП"
          />
        </FieldLabel>
        <FieldLabel text="Дата расчёта">
          <input
            type="date"
            className={`${inputCls}`}
            value={calcDate}
            onChange={(e) => setCalcDate(e.target.value)}
          />
        </FieldLabel>
      </div>

      <VDivider />

      {/* cosPhi + transformer power */}
      <div className="flex gap-3 items-end">
        <FieldLabel text="cos φ">
          <input
            className={`${inputCls} w-15`}
            value={cosPhi}
            onChange={(e) => setCosPhi(e.target.value)}
            placeholder="0.9"
          />
        </FieldLabel>
        <FieldLabel text="Мощность тр-ра">
          <select
            className={`${inputCls} w-25 cursor-pointer`}
            value={transformerPower}
            onChange={(e) => setTransformerPower(e.target.value as TransformerPower)}
          >
            {TRANSFORMER_POWERS.map((p) => (
              <option key={p} value={p}>
                {p} кВА
              </option>
            ))}
          </select>
        </FieldLabel>
      </div>

      <VDivider />

      {/* Results */}
      <div className="flex gap-4 items-center shrink-0">
        <ResultBadge label="Загрузка тр-ра" value={transformerLoad} unit="%" status={loadStatus} />
        <ResultBadge
          label="Потеря напряжения"
          value={voltageDrop || 0}
          unit="%"
          status={dropStatus}
        />
        <ResultBadge
          label="Резерв мощности"
          value={powerReserve}
          unit="кВА"
          status={reserveStatus}
        />

        <ResultBadge
          label="Длина линии"
          value={lineLength}
          unit="м"
          status={ResultStatus.DEFAULT}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <div className="flex gap-1.5 items-center shrink-0">
        <button
          onClick={onThemeToggle}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          className="h-7 px-2 text-sm border border-[#30363d] rounded text-[#6e7681]
            hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all cursor-pointer"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
