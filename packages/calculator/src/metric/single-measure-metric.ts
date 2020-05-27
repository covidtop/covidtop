import { MeasureType } from '@covidtop/shared/lib/measure'
import { sumBy } from '@covidtop/shared/lib/utils'

import { BaseRecord, BaseData } from '../base'
import { CalculateSnapshot, SnapshotContext } from './snapshot-context'

export const getNewValueSnapshot = (measureType: MeasureType): CalculateSnapshot => {
  return (baseData: BaseData, context: SnapshotContext) => {
    const measureIndex = baseData.measureTypes.indexOf(measureType)
    const currentDateIndex = context.metricContext.topicData.dates.indexOf(context.currentDate)

    return (baseRecord: BaseRecord) => baseRecord.measurePerTypeAndDate[measureIndex][currentDateIndex]
  }
}

export const getTotalValueSnapshot = (measureType: MeasureType): CalculateSnapshot => {
  return (baseData: BaseData, context: SnapshotContext) => {
    const measureIndex = baseData.measureTypes.indexOf(measureType)
    const currentDateIndex = context.metricContext.topicData.dates.indexOf(context.currentDate)

    return (baseRecord: BaseRecord) =>
      sumBy(
        baseRecord.measurePerTypeAndDate[measureIndex].filter((measure, dateIndex) => dateIndex <= currentDateIndex),
        (measure) => measure,
      )
  }
}
