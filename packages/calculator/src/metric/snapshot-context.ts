import { BaseRecord } from '../base'
import { MetricContext } from './metric-context'

export interface SnapshotContext {
  readonly metricContext: MetricContext
  readonly currentDate: string
}

export type CalculateSnapshot = (context: SnapshotContext) => (baseRecord: BaseRecord) => number | undefined
