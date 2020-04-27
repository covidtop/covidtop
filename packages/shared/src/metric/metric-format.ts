import { format } from 'd3-format'

import { mapValues } from '../utils'

export type MetricFormatType = 'decimal' | 'percent'

type NumberFormatter = (value?: number) => string | undefined

export interface MetricFormat {
  readonly metricFormatType: MetricFormatType
  readonly apply: NumberFormatter
}

const createFormatter = (pattern: string): NumberFormatter => {
  const formatter = format(pattern)
  return (value) => {
    if (typeof value === 'undefined') {
      return 'N/A'
    }

    return formatter(value)
  }
}

const decimalFormatter = createFormatter(',d')
const percentFormatter = createFormatter(',.1%')

const partialMetricFormatByType: Readonly<Record<MetricFormatType, Omit<MetricFormat, 'metricFormatType'>>> = {
  decimal: {
    apply: decimalFormatter,
  },
  percent: {
    apply: percentFormatter,
  },
}

export const metricFormatByType: Readonly<Record<MetricFormatType, MetricFormat>> = mapValues(
  partialMetricFormatByType,
  (partialMetricFormat, metricFormatType) => ({
    metricFormatType,
    ...partialMetricFormat,
  }),
)
