import { MainRecord } from '@covidtop/shared/lib/dataset'

import { MetricContext } from './metric-context'

export interface SnapshotContext {
  readonly metricContext: MetricContext
  readonly currentDate: string
}

export type CalculateSnapshot = (context: SnapshotContext) => (mainRecord: MainRecord) => number | undefined
