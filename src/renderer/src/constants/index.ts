export {
  TRANSFORMER_POWERS,
  TRANSFORMER_SELECTION,
  getTransformerPower,
  TransformerScheme,
  getTransformerParams
} from './transformers'

export type { TransformerPower } from './transformers'

export { WIRE_MARKS, getWireResistance_om_km } from './wires'
export { INDUSTRIAL_SIMULTANEITY_FACTOR, RESIDENTIAL_SIMULTANEITY_FACTOR } from './kSim'
export { PHASE_OPTIONS, LOAD_TYPES, SECTION_RESULT_LABEL } from './sections'
export { Unom220, Usource400, Usource230, UmaxAllow, UminAllow } from './voltage'

export const defaultConstants = {
  cosPhi: 0.9,
  k_heatDec: 1,
  dUallow: 13
}
