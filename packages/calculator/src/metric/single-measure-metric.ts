import { MeasureType } from '@covidtop/shared/lib/measure'
import { sumBy } from '@covidtop/shared/lib/utils'

import { CalculateSnapshot, SnapshotContext } from './snapshot-context'

export const getNewValueSnapshot = (measureType: MeasureType): CalculateSnapshot => {
  return (context: SnapshotContext) => {
    const measureIndex = context.metricContext.datasetConfig.measureConfig.measureTypes.indexOf(measureType)
    const currentDateIndex = context.metricContext.mainData.referenceData.dates.indexOf(context.currentDate)

    return (mainRecord) => mainRecord.dailyMeasures[measureIndex][currentDateIndex]
  }
}

export const getTotalValueSnapshot = (measureType: MeasureType): CalculateSnapshot => {
  return (context: SnapshotContext) => {
    const measureIndex = context.metricContext.datasetConfig.measureConfig.measureTypes.indexOf(measureType)
    const currentDateIndex = context.metricContext.mainData.referenceData.dates.indexOf(context.currentDate)

    return (mainRecord) =>
      sumBy(
        mainRecord.dailyMeasures[measureIndex].filter((measure, dateIndex) => dateIndex <= currentDateIndex),
        (measure) => measure,
      )
  }
}
