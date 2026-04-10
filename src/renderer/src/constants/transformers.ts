export const TRANSFORMER_POWERS = [
  '25',
  '40',
  '63',
  '100',
  '160',
  '250',
  '400',
  '630',
  '1000'
] as const
export type TransformerPower = (typeof TRANSFORMER_POWERS)[number]
export enum TransformerScheme {
  SS = 'Y/Yo',
  TS = '△/Yo'
}

export const POWER_SCHEMES: Record<TransformerPower, TransformerScheme[]> = {
  '25': [TransformerScheme.SS],
  '40': [TransformerScheme.SS],
  '63': [TransformerScheme.SS],
  '100': [TransformerScheme.SS],
  '160': [TransformerScheme.SS],
  '250': [TransformerScheme.SS],
  '400': [TransformerScheme.SS, TransformerScheme.TS],
  '630': [TransformerScheme.SS, TransformerScheme.TS],
  '1000': [TransformerScheme.SS, TransformerScheme.TS]
}

const TRANSFORMER_PARAMS: Record<
  TransformerScheme,
  Partial<Record<TransformerPower, { zt: number; zt0: number }>>
> = {
  [TransformerScheme.SS]: {
    '25': { zt: 0.288, zt0: 1.04 },
    '40': { zt: 0.18, zt0: 0.65 },
    '63': { zt: 0.114, zt0: 0.411 },
    '100': { zt: 0.07, zt0: 0.26 },
    '160': { zt: 0.045, zt0: 0.162 },
    '250': { zt: 0.0288, zt0: 0.104 },
    '400': { zt: 0.018, zt0: 0.065 },
    '630': { zt: 0.014, zt0: 0.042 },
    '1000': { zt: 0.0088, zt0: 0.027 }
  },
  [TransformerScheme.TS]: {
    '400': { zt: 0.018, zt0: 0.019 },
    '630': { zt: 0.014, zt0: 0.014 },
    '1000': { zt: 0.0088, zt0: 0.009 }
  }
}

export function getTransformerParams(
  scheme: TransformerScheme,
  power: TransformerPower
): { zt: number; zt0: number } | null {
  return TRANSFORMER_PARAMS[scheme][power] ?? null
}

export const TRANSFORMER_SELECTION = [
  { min: 0, max: 40, powerKva: 25 },
  { min: 41, max: 64, powerKva: 40 },
  { min: 65, max: 101, powerKva: 63 },
  { min: 102, max: 160, powerKva: 100 },
  { min: 161, max: 257, powerKva: 160 },
  { min: 258, max: 391, powerKva: 250 },
  { min: 392, max: 626, powerKva: 400 },
  { min: 627, max: 987, powerKva: 630 },
  { min: 988, max: 1550, powerKva: 1000 }
]

export const getTransformerPower = (loadKw) => {
  const load = Math.ceil(loadKw)
  const result = TRANSFORMER_SELECTION.find((item) => load >= item.min && load <= item.max)

  return result ? result.powerKva : null
}
