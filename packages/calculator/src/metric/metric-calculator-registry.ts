import { MetricType } from '@covidtop/shared/lib/metric'
import { keyBy } from '@covidtop/shared/lib/utils'

import { activeCalculator } from './active-calculator'
import { confirmedCalculator } from './confirmed-calculator'
import { deathsCalculator } from './deaths-calculator'
import { fatalityRateCalculator } from './fatality-rate-calculator'
import { MetricCalculator } from './metric-calculator'
import { recoveredCalculator } from './recovered-calculator'

const metricCalculators: MetricCalculator[] = [
  confirmedCalculator,
  deathsCalculator,
  recoveredCalculator,
  activeCalculator,
  fatalityRateCalculator,
]

export const metricCalculatorByType: Readonly<Record<MetricType, MetricCalculator>> = keyBy(
  metricCalculators,
  ({ metricType }) => metricType,
)
