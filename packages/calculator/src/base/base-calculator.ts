import { TopicData, TopicRecord } from '@covidtop/shared/lib/topic'
import { groupBy, sumBy } from '@covidtop/shared/lib/utils'

import { BaseRecord } from './base-record'

export interface FilterOptions {
  readonly locationTypeCode: string
  readonly locationCodes: string[]
}

export interface GroupOptions {
  readonly locationTypeCode: string
}

export interface GetBaseRecordsOptions {
  readonly filter?: FilterOptions
  readonly group?: GroupOptions
}

const getFiltering = (filter: FilterOptions | undefined, topicData: TopicData) => {
  if (!filter || filter.locationTypeCode === topicData.rootLocation.type) {
    return () => true
  }

  const filterLocationIndex = topicData.locationGroups.findIndex(
    ({ locationType }) => locationType.code === filter.locationTypeCode,
  )

  return (topicRecord: TopicRecord) => {
    return filter.locationCodes.includes(topicRecord.locationCodePerType[filterLocationIndex])
  }
}

const getGrouping = (group: GroupOptions | undefined, topicData: TopicData) => {
  if (!group || group.locationTypeCode === topicData.rootLocation.type) {
    return () => topicData.rootLocation.code
  }

  const groupLocationIndex = topicData.locationGroups.findIndex(
    ({ locationType }) => locationType.code === group.locationTypeCode,
  )

  return (topicRecord: TopicRecord) => {
    return topicRecord.locationCodePerType[groupLocationIndex]
  }
}

const aggregateMeasurePerTypeAndDate = (topicRecords: TopicRecord[], topicData: TopicData): number[][] => {
  return topicData.measureTypes.map((measureType, measureIndex) => {
    return topicData.dates.map((date, dateIndex) => {
      return sumBy(topicRecords, (topicRecord) => {
        return topicRecord.measurePerTypeAndDate[measureIndex][dateIndex]
      })
    })
  })
}

const getBaseRecords = (topicData: TopicData, options: GetBaseRecordsOptions): BaseRecord[] => {
  const { filter, group } = options

  const topicRecordsByLocationCode = groupBy(
    topicData.topicRecords.filter(getFiltering(filter, topicData)),
    getGrouping(group, topicData),
  )

  return Object.entries(topicRecordsByLocationCode).map(([locationCode, topicRecords]) => {
    return {
      locationCode,
      measurePerTypeAndDate: aggregateMeasurePerTypeAndDate(topicRecords, topicData),
    }
  })
}

export const baseCalculator = {
  getBaseRecords,
}
