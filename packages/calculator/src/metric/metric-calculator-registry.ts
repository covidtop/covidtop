import { MetricType } from '@covidtop/shared/lib/metric'
import { mapValues } from '@covidtop/shared/lib/utils'

import { activeMetricBuilder } from './active-metric'
import { confirmedMetricBuilder } from './confirmed-metric'
import { deathsMetricBuilder } from './deaths-metric'
import { fatalityRateMetricBuilder } from './fatality-rate-metric'
import { MetricCalculator } from './metric-calculator'
import { recoveredMetricBuilder } from './recovered-metric'

const partialMetricCalculatorByType: Readonly<Record<MetricType, Omit<MetricCalculator, 'metricType'>>> = {
  confirmed: {
    metricBuilder: confirmedMetricBuilder,
  },
  deaths: {
    metricBuilder: deathsMetricBuilder,
  },
  recovered: {
    metricBuilder: recoveredMetricBuilder,
  },
  active: {
    metricBuilder: activeMetricBuilder,
  },
  'fatality-rate': {
    metricBuilder: fatalityRateMetricBuilder,
  },
}

export const metricCalculatorByType: Readonly<Record<MetricType, MetricCalculator>> = mapValues(
  partialMetricCalculatorByType,
  (partialMetricCalculator, metricType) => ({
    metricType,
    ...partialMetricCalculator,
  }),
)
