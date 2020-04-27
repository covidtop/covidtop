import { MetricType } from '@covidtop/shared/lib/metric'

import { CalculateSnapshot } from './snapshot-context'

export interface MetricCalculator {
  readonly metricType: MetricType
  readonly getSnapshot: CalculateSnapshot
}
