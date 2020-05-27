import { MeasureType } from '../measure'
import { MeasureGroupRecord } from './measure-group-record'

export interface MeasureGroup {
  readonly measureTypes: MeasureType[]
  readonly locationTypeCodes: string[]
  readonly records: MeasureGroupRecord[]
}
