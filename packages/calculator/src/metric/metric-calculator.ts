import { MetricType } from '@covidtop/shared/lib/metric'

import { BaseRecord } from '../base'
import { MetricContext } from './metric-context'

export type MetricBuilder = (
  metricContext: MetricContext,
) => (baseRecord: BaseRecord, dateIndex: number) => number | undefined

export interface MetricCalculator {
  readonly metricType: MetricType
  readonly metricBuilder: MetricBuilder
}
