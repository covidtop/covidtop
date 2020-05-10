import { LocationGroup } from '@covidtop/shared/lib/location'
import { TopicConfig, TopicRecord } from '@covidtop/shared/lib/topic'
import { flatMap, getDatesBetween, getMax, getMin, keyBy } from '@covidtop/shared/lib/utils'

import { locationDataHelper } from '../common'
import { JhuMeasureFile } from './jhu-measure-file'
import { JhuRecord } from './jhu-record'

const getAllDates = (measureFiles: JhuMeasureFile[]): string[] => {
  const minDate = getMin(measureFiles.map(({ dates }) => dates[0]))
  const maxDate = getMax(measureFiles.map(({ dates }) => dates[dates.length - 1]))
  if (!minDate || !maxDate) {
    throw new Error('No date found')
  }
  return getDatesBetween(minDate, maxDate)
}

const getValuePerDate = (record: JhuRecord, dates: string[]): number[] => {
  const totalPerDate = dates.reduce((currentTotalPerDate: number[], date, dateIndex) => {
    const currentTotal = record.totalByDate[date]
    if (typeof currentTotal === 'undefined') {
      currentTotalPerDate.push(dateIndex === 0 ? 0 : currentTotalPerDate[dateIndex - 1])
    } else {
      currentTotalPerDate.push(currentTotal)
    }
    return currentTotalPerDate
  }, [])

  return totalPerDate.reduce((currentValuePerDate: number[], total, dateIndex) => {
    currentValuePerDate.push(dateIndex === 0 ? total : total - totalPerDate[dateIndex - 1])
    return currentValuePerDate
  }, [])
}

const getTopicRecord = (
  topicRecordByLocationKey: Record<string, TopicRecord>,
  jhuRecord: JhuRecord,
  topicConfig: TopicConfig,
  dates: string[],
): TopicRecord => {
  const locationKey = locationDataHelper.getLocationKey(jhuRecord)

  const existingTopicRecord: TopicRecord | undefined = topicRecordByLocationKey[locationKey]
  if (existingTopicRecord) {
    return existingTopicRecord
  }

  const topicRecord: TopicRecord = {
    locationCodePerType: locationDataHelper.getLocationCodes(jhuRecord),
    measurePerTypeAndDate: topicConfig.measureConfig.measureTypes.map(() => {
      return dates.map(() => 0)
    }),
  }

  topicRecordByLocationKey[locationKey] = topicRecord

  return topicRecord
}

const getTopicRecords = (measureFiles: JhuMeasureFile[], topicConfig: TopicConfig, dates: string[]): TopicRecord[] => {
  const measureFileByType = keyBy(measureFiles, ({ measureType }) => measureType)
  const topicRecordByLocationKey: Record<string, TopicRecord> = {}

  topicConfig.measureConfig.measureTypes.forEach((measureType, measureIndex) => {
    const measureFile = measureFileByType[measureType]
    if (!measureFile) {
      throw new Error(`${measureType} has no measure file`)
    }

    measureFile.records.forEach((record) => {
      const topicRecord = getTopicRecord(topicRecordByLocationKey, record, topicConfig, dates)
      topicRecord.measurePerTypeAndDate[measureIndex] = getValuePerDate(record, dates)
    })
  })

  return Object.values(topicRecordByLocationKey)
}

export interface JhuMeasureFileMergeResult {
  readonly dates: string[]
  readonly locationGroups: LocationGroup[]
  readonly topicRecords: TopicRecord[]
}

export const mergeJhuMeasureFiles = (
  measureFiles: JhuMeasureFile[],
  topicConfig: TopicConfig,
): JhuMeasureFileMergeResult => {
  const dates: string[] = getAllDates(measureFiles)

  const locationGroups: LocationGroup[] = locationDataHelper.getLocationGroups(
    flatMap(measureFiles, ({ records }) => records),
    topicConfig,
  )

  const topicRecords: TopicRecord[] = getTopicRecords(measureFiles, topicConfig, dates)

  return {
    dates,
    locationGroups,
    topicRecords,
  }
}
