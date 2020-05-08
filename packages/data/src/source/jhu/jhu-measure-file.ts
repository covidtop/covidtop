import { MeasureType } from '@covidtop/shared/lib/measure'

import { JhuRecord } from './jhu-record'

export interface JhuMeasureFile {
  readonly measureType: MeasureType
  readonly dates: string[]
  readonly records: JhuRecord[]
}
