import { BaseRecord } from '../base'
import { confirmedCalculator } from './confirmed-calculator'
import { deathsCalculator } from './deaths-calculator'
import { MetricCalculator } from './metric-calculator'
import { MetricContext } from './metric-context'
import { metricHelper } from './metric-helper'

export const fatalityRateCalculator: MetricCalculator = {
  metricType: 'fatality-rate',
  getValue: (metricContext: MetricContext) => {
    const getConfirmedValue = confirmedCalculator.getValue(metricContext)
    const getDeathsValue = deathsCalculator.getValue(metricContext)

    return (baseRecord: BaseRecord, dateIndex: number) => {
      const confirmed = getConfirmedValue(baseRecord, dateIndex)
      const deaths = getDeathsValue(baseRecord, dateIndex)

      if (!confirmed) {
        return 0
      }

      return metricHelper.getRatio(deaths || 0, confirmed)
    }
  },
}
