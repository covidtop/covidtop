import { mapValues } from '../utils'
import { MetricCategoryType } from './metric-category-type'

export interface MetricCategory {
  readonly type: MetricCategoryType
  readonly name: string
}

const partialMetricCategoryByType: Readonly<Record<MetricCategoryType, Omit<MetricCategory, 'type'>>> = {
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
}

export const metricCategoryByType: Readonly<Record<MetricCategoryType, MetricCategory>> = mapValues(
  partialMetricCategoryByType,
  (partialMetricCategory, type) => ({
    type,
    ...partialMetricCategory,
  }),
)
