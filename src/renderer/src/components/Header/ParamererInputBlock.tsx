import { TRANSFORMER_POWERS, TransformerPower } from '@renderer/constants'
import { inputCls } from '..'
import { FieldLabel } from '../FieldLabel'
import { LoadSummary } from '@renderer/utils/electricCalc'
import { CosPhiField } from '../validatedFields/CosPhiField'
import { DUPercentField } from '../validatedFields/DUPercentField'

interface ParameterInputBlock {
  cosPhi: string
  setCosPhi: (v: string) => void
  dUallow: string
  setDUallow: (v: string) => void
  useKsim: boolean
  setUseKsim: (v: boolean) => void
  loadSummary: LoadSummary
  transformerPower: string
  setTransformerPower: (v: TransformerPower) => void
}

export function ParameterInputBlock({
  cosPhi,
  setCosPhi,
  dUallow,
  setDUallow,
  loadSummary,
  useKsim,
  setUseKsim,
  transformerPower,
  setTransformerPower
}: ParameterInputBlock) {
  return (
    <div className="flex gap-3 items-end">
      <div className="flex flex-col gap-1 w-25">
        <CosPhiField value={cosPhi} setCosPhi={setCosPhi} />
        <DUPercentField value={dUallow} setDUAllow={setDUallow} />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel text="Учитывать Кодн" addClsName="">
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              className="w-4 h-4 accent-green-500 cursor-pointer"
              checked={useKsim}
              onChange={(e) => setUseKsim(e.target.checked)}
            />
            <div className="flex flex-col text-[10px] text-gray-300">
              <span>Kбыт = {loadSummary.household.ksim}</span>
              <span>Kпром = {loadSummary.prom.ksim}</span>
            </div>
          </div>
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
    </div>
  )
}
