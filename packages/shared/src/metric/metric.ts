import { mapValues } from '../utils'
import { metricCategoryByType } from './metric-category'
import { MetricCategoryType } from './metric-category-type'
import { MetricFormatType } from './metric-format'
import { MetricType } from './metric-type'

export interface Metric {
  readonly type: MetricType
  readonly categoryTypes: MetricCategoryType[]
  readonly name: string
  readonly formatType?: MetricFormatType
  readonly defaultAsc?: boolean
}

const partialMetricByType: Readonly<Record<MetricType, Omit<Metric, 'type'>>> = {
  'new-confirmed-value': {
    categoryTypes: ['confirmed'],
    name: `New ${metricCategoryByType.confirmed.name}`,
  },
  'total-confirmed-value': {
    categoryTypes: ['confirmed'],
    name: `Total ${metricCategoryByType.confirmed.name}`,
  },
  'new-deaths-value': {
    categoryTypes: ['deaths'],
    name: `New ${metricCategoryByType.deaths.name}`,
  },
  'total-deaths-value': {
    categoryTypes: ['deaths'],
    name: `Total ${metricCategoryByType.deaths.name}`,
  },
  'new-recovered-value': {
    categoryTypes: ['recovered'],
    name: `New ${metricCategoryByType.recovered.name}`,
  },
  'total-recovered-value': {
    categoryTypes: ['recovered'],
    name: `Total ${metricCategoryByType.recovered.name}`,
  },
  'total-active-value': {
    categoryTypes: ['active'],
    name: 'Total Active Cases',
  },
  'fatality-rate-value': {
    categoryTypes: ['deaths'],
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
