import { MetricType } from '@covidtop/shared/lib/metric'
import { mapValues } from '@covidtop/shared/lib/utils'

import { getTotalActiveValueSnapshot } from './active-metric'
import { getNewConfirmedValueSnapshot, getTotalConfirmedValueSnapshot } from './confirmed-metric'
import { getNewDeathsValueSnapshot, getTotalDeathsValueSnapshot } from './deaths-metric'
import { getFatalityRateValueSnapshot } from './fatality-rate-metric'
import { MetricCalculator } from './metric-calculator'
import { getNewRecoveredValueSnapshot, getTotalRecoveredValueSnapshot } from './recovered-metric'

const partialMetricCalculatorByType: Readonly<Record<MetricType, Omit<MetricCalculator, 'metricType'>>> = {
  'new-confirmed-value': {
    getSnapshot: getNewConfirmedValueSnapshot,
  },
  'total-confirmed-value': {
    getSnapshot: getTotalConfirmedValueSnapshot,
  },
  'new-deaths-value': {
    getSnapshot: getNewDeathsValueSnapshot,
  },
  'total-deaths-value': {
    getSnapshot: getTotalDeathsValueSnapshot,
  },
  'new-recovered-value': {
    getSnapshot: getNewRecoveredValueSnapshot,
  },
  'total-recovered-value': {
    getSnapshot: getTotalRecoveredValueSnapshot,
  },
  'total-active-value': {
    getSnapshot: getTotalActiveValueSnapshot,
  },
  'fatality-rate-value': {
    getSnapshot: getFatalityRateValueSnapshot,
  },
}

export const metricCalculatorByType: Readonly<Record<MetricType, MetricCalculator>> = mapValues(
  partialMetricCalculatorByType,
  (partialMetricCalculator, metricType) => ({
    metricType,
    ...partialMetricCalculator,
  }),
)
