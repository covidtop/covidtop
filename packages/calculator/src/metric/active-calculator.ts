import { BaseRecord } from '../base'
import { confirmedCalculator } from './confirmed-calculator'
import { deathsCalculator } from './deaths-calculator'
import { MetricCalculator } from './metric-calculator'
import { MetricContext } from './metric-context'
import { recoveredCalculator } from './recovered-calculator'

export const activeCalculator: MetricCalculator = {
  metricType: 'active',
  getValue: (metricContext: MetricContext) => {
    const getConfirmedValue = confirmedCalculator.getValue(metricContext)
    const getDeathsValue = deathsCalculator.getValue(metricContext)
    const getRecoveredValue = recoveredCalculator.getValue(metricContext)

    return (baseRecord: BaseRecord, dateIndex: number) => {
      const confirmed = getConfirmedValue(baseRecord, dateIndex)
      const deaths = getDeathsValue(baseRecord, dateIndex)
      const recovered = getRecoveredValue(baseRecord, dateIndex)

      return (confirmed || 0) - (deaths || 0) - (recovered || 0)
    }
  },
}
