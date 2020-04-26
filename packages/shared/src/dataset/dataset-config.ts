import { LocationConfig } from '../location'
import { MeasureConfig } from '../measure'

export interface DatasetConfig {
  readonly id: string
  readonly name: string
  readonly locationConfig: LocationConfig
  readonly measureConfig: MeasureConfig
}
