import { MetricType } from '@covidtop/shared/lib/metric'

import { BaseRecord } from '../base'
import { MetricContext } from './metric-context'

export type GetMetricValue = (baseRecord: BaseRecord, dateIndex: number) => number | undefined

export type GetMetricValueWithContext = (metricContext: MetricContext) => GetMetricValue

export interface MetricCalculator {
  readonly metricType: MetricType
  readonly getValue: GetMetricValueWithContext
}
