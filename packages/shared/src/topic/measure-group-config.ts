import { MeasureType } from '../measure'

export interface MeasureGroupConfig {
  readonly measureTypes: MeasureType[]
  readonly locationTypeCodes: string[]
}
