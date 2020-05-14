import { mapValues } from '../utils'
import { MetricFormatType } from './metric-format'
import { MetricType } from './metric-type'

export interface Metric {
  readonly type: MetricType
  readonly name: string
  readonly formatType?: MetricFormatType
  readonly defaultAsc?: boolean
}

const partialMetricByType: Readonly<Record<MetricType, Omit<Metric, 'type'>>> = {
  confirmed: {
    name: 'Confirmed Cases',
  },
  deaths: {
    name: 'Deaths',
  },
  recovered: {
    name: 'Recovered Cases',
  },
  active: {
    name: 'Active Cases',
  },
  'fatality-rate': {
    name: 'Fatality Rate',
    formatType: 'percent',
  },
}

export const metricByType: Readonly<Record<MetricType, Metric>> = mapValues(
  partialMetricByType,
  (partialMetric, type) => ({
    type,
    ...partialMetric,
  }),
)
