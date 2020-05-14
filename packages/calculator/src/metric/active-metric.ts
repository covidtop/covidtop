import { BaseRecord } from '../base'
import { confirmedMetricBuilder } from './confirmed-metric'
import { deathsMetricBuilder } from './deaths-metric'
import { MetricBuilder } from './metric-calculator'
import { MetricContext } from './metric-context'
import { recoveredMetricBuilder } from './recovered-metric'

export const activeMetricBuilder: MetricBuilder = (metricContext: MetricContext) => {
  const calculateConfirmed = confirmedMetricBuilder(metricContext)
  const calculateDeaths = deathsMetricBuilder(metricContext)
  const calculateRecovered = recoveredMetricBuilder(metricContext)

  return (baseRecord: BaseRecord, dateIndex: number) => {
    return (
      (calculateConfirmed(baseRecord, dateIndex) || 0) -
      (calculateDeaths(baseRecord, dateIndex) || 0) -
      (calculateRecovered(baseRecord, dateIndex) || 0)
    )
  }
}
