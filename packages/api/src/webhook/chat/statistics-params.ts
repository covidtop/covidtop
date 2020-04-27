import { MetricType } from '@covidtop/shared/lib/metric'

export type StatisticsType = 'summary' | 'trend' | 'top'

export interface StatisticsParams {
  readonly type: StatisticsType
  readonly metricTypes: MetricType[]
  readonly locationQueries: string[]
  readonly breakdownLocationTypeCode?: string
}
