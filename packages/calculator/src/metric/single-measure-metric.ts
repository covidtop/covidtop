import { MeasureType } from '@covidtop/shared/lib/measure'
import { sumBy } from '@covidtop/shared/lib/utils'

import { BaseRecord } from '../base'
import { GetMetricValue, GetMetricValueWithContext } from './metric-calculator'
import { MetricContext } from './metric-context'
import { getTimePeriodResolver } from './time-period-resolver'

export const getMetricValueBySingleMeasure = (measureType: MeasureType): GetMetricValueWithContext => {
  return (metricContext: MetricContext): GetMetricValue => {
    const { topicConfig, topicData } = metricContext
    const measureIndex = topicConfig.measureConfig.measureTypes.indexOf(measureType)
    const timePeriodResolver = getTimePeriodResolver(metricContext)
    const maxDateIndex = topicData.dates.length - 1

    return (baseRecord: BaseRecord, dateIndex: number): number | undefined => {
      const endDateIndex = dateIndex
      const startDateIndex = timePeriodResolver.getStartDateIndex(endDateIndex)

      if (startDateIndex < 0 || endDateIndex > maxDateIndex) {
        return
      }

      return sumBy(
        baseRecord.measurePerTypeAndDate[measureIndex].slice(startDateIndex, endDateIndex + 1),
        (value) => value,
      )
    }
  }
}
