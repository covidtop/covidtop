import { measureInfoByType } from '../measure'
import { mapValues } from '../utils'
import { MetricFormatType } from './metric-format'
import { MetricType } from './metric-type'

export interface MetricInfo {
  readonly metricType: MetricType
  readonly name: string
  readonly formatType?: MetricFormatType
  readonly defaultAsc?: boolean
}

const partialMetricInfoByType: Readonly<Record<MetricType, Omit<MetricInfo, 'metricType'>>> = {
  'new-confirmed-value': {
    name: `New ${measureInfoByType.confirmed.name}`,
  },
  'total-confirmed-value': {
    name: `Total ${measureInfoByType.confirmed.name}`,
  },
  'new-deaths-value': {
    name: `New ${measureInfoByType.deaths.name}`,
  },
  'total-deaths-value': {
    name: `Total ${measureInfoByType.deaths.name}`,
  },
  'new-recovered-value': {
    name: `New ${measureInfoByType.recovered.name}`,
  },
  'total-recovered-value': {
    name: `Total ${measureInfoByType.recovered.name}`,
  },
  'total-active-value': {
    name: 'Total Active Cases',
  },
  'fatality-rate-value': {
    name: 'Fatality Rate',
    formatType: 'percent',
  },
}

export const metricInfoByType: Readonly<Record<MetricType, MetricInfo>> = mapValues(
  partialMetricInfoByType,
  (partialMetricInfo, metricType) => ({
    metricType,
    ...partialMetricInfo,
  }),
)
