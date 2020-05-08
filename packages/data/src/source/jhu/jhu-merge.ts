import { Location, LocationGroup } from '@covidtop/shared/lib/location'
import { TopicConfig, TopicRecord } from '@covidtop/shared/lib/topic'
import { getDatesBetween, getMax, getMin, keyBy } from '@covidtop/shared/lib/utils'

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

const getLocationGroups = (measureFiles: JhuMeasureFile[], topicConfig: TopicConfig): LocationGroup[] => {
  return topicConfig.locationConfig.locationTypes.map(
    (locationType, locationIndex): LocationGroup => {
      const locationByCode: Record<string, Location> = {}
      measureFiles.forEach((measureFile) => {
        measureFile.records.forEach((record) => {
          const location = record.locations[locationIndex]
          locationByCode[location.code] = location
        })
      })

      return {
        locationType,
        locationByCode,
      }
    },
  )
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
  locationCodes: string[],
  topicConfig: TopicConfig,
  dates: string[],
): TopicRecord => {
  const locationKey = locationCodes.join('$')

  const existingTopicRecord: TopicRecord | undefined = topicRecordByLocationKey[locationKey]
  if (existingTopicRecord) {
    return existingTopicRecord
  }

  const topicRecord: TopicRecord = {
    locationCodePerType: locationCodes,
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
      const locationCodes = record.locations.map(({ code }) => code)
      const topicRecord = getTopicRecord(topicRecordByLocationKey, locationCodes, topicConfig, dates)
      topicRecord.measurePerTypeAndDate[measureIndex] = getValuePerDate(record, dates)
    })
  })

  return Object.values(topicRecordByLocationKey)
}

export interface JhuMeasureFileMergeResult {
  readonly dates: string[]
  readonly topicRecords: TopicRecord[]
  readonly locationGroups: LocationGroup[]
}

export const mergeJhuMeasureFiles = (
  measureFiles: JhuMeasureFile[],
  topicConfig: TopicConfig,
): JhuMeasureFileMergeResult => {
  const dates: string[] = getAllDates(measureFiles)
  const locationGroups: LocationGroup[] = getLocationGroups(measureFiles, topicConfig)
  const topicRecords: TopicRecord[] = getTopicRecords(measureFiles, topicConfig, dates)

  return {
    locationGroups,
    dates,
    topicRecords,
  }
}
