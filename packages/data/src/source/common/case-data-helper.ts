import { Location, LocationGroup } from '@covidtop/shared/lib/location'
import { TopicConfig, TopicRecord } from '@covidtop/shared/lib/topic'
import { fastSort, getDatesBetween, groupBy, mapValues } from '@covidtop/shared/lib/utils'

import { locationDataHelper } from './location-data-helper'

export interface CaseRecord {
  readonly locations: Location[]
  readonly date: string
}

const getTopicRecords = (caseRecords: CaseRecord[], topicConfig: TopicConfig, dates: string[]): TopicRecord[] => {
  const caseRecordsByLocationKey = groupBy(caseRecords, locationDataHelper.getLocationKey)

  return Object.values(caseRecordsByLocationKey).map(
    (caseRecordsPerLocationKey): TopicRecord => {
      const caseCountByDate: Record<string, number> = mapValues(
        groupBy(caseRecordsPerLocationKey, ({ date }) => date),
        ({ length }) => length,
      )

      return {
        locationCodePerType: locationDataHelper.getLocationCodes(caseRecordsPerLocationKey[0]),
        measurePerTypeAndDate: [dates.map((date) => caseCountByDate[date] || 0)],
      }
    },
  )
}

export interface CaseRecordProcessResult {
  readonly dates: string[]
  readonly topicRecords: TopicRecord[]
  readonly locationGroups: LocationGroup[]
}

const processCaseRecords = (caseRecords: CaseRecord[], topicConfig: TopicConfig): CaseRecordProcessResult => {
  const sortedCaseRecords = [...caseRecords]
  fastSort(sortedCaseRecords).asc(({ date }) => date)
  const minDate = sortedCaseRecords[0].date
  const maxDate = sortedCaseRecords[sortedCaseRecords.length - 1].date
  const dates = getDatesBetween(minDate, maxDate)

  const locationGroups = locationDataHelper.getLocationGroups(sortedCaseRecords, topicConfig)

  const topicRecords: TopicRecord[] = getTopicRecords(sortedCaseRecords, topicConfig, dates)

  return {
    locationGroups,
    dates,
    topicRecords,
  }
}

export const caseDataHelper = {
  processCaseRecords,
}
