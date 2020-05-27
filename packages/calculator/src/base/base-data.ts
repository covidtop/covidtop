import { MeasureType } from '@covidtop/shared/lib/measure'
import { BaseRecord } from './base-record'

export interface BaseData {
  readonly measureTypes: MeasureType[]
  readonly records: BaseRecord[]
}
