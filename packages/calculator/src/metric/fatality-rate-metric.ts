import { BaseRecord } from '../base'
import { confirmedMetricBuilder } from './confirmed-metric'
import { deathsMetricBuilder } from './deaths-metric'
import { MetricBuilder } from './metric-calculator'
import { MetricContext } from './metric-context'
import { metricHelper } from './metric-helper'

export const fatalityRateMetricBuilder: MetricBuilder = (metricContext: MetricContext) => {
  const calculateConfirmed = confirmedMetricBuilder(metricContext)
  const calculateDeaths = deathsMetricBuilder(metricContext)

  return (baseRecord: BaseRecord, dateIndex: number) => {
    const confirmed = calculateConfirmed(baseRecord, dateIndex)

    if (!confirmed) {
      return 0
    }

    return metricHelper.getRatio(calculateDeaths(baseRecord, dateIndex) || 0, confirmed)
  }
}
