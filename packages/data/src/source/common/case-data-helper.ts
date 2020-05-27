import { Location } from '@covidtop/shared/lib/location'
import { LocationGroup, MeasureGroupRecord, TopicConfig } from '@covidtop/shared/lib/topic'
import { fastSort, getDatesBetween, groupBy, mapValues } from '@covidtop/shared/lib/utils'

import { locationDataHelper } from './location-data-helper'

export interface CaseRecord {
  readonly locations: Location[]
  readonly date: string
}

const getMeasureGroupRecords = (caseRecords: CaseRecord[], dates: string[]): MeasureGroupRecord[] => {
  const caseRecordsByLocationKey = groupBy(caseRecords, (caseRecord) => locationDataHelper.getLocationKey(caseRecord))

  return Object.values(caseRecordsByLocationKey).map(
    (caseRecordsPerLocationKey): MeasureGroupRecord => {
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
  readonly locationGroups: LocationGroup[]
  readonly measureGroupRecords: MeasureGroupRecord[]
}

const processCaseRecords = (caseRecords: CaseRecord[], topicConfig: TopicConfig): CaseRecordProcessResult => {
  const sortedCaseRecords = [...caseRecords]
  fastSort(sortedCaseRecords).asc(({ date }) => date)
  const minDate = sortedCaseRecords[0].date
  const maxDate = sortedCaseRecords[sortedCaseRecords.length - 1].date
  const dates = getDatesBetween(minDate, maxDate)

  const locationGroups = locationDataHelper.getLocationGroups(sortedCaseRecords, topicConfig)

  const measureGroupRecords: MeasureGroupRecord[] = getMeasureGroupRecords(sortedCaseRecords, dates)

  return {
    locationGroups,
    dates,
    measureGroupRecords,
  }
}

export const caseDataHelper = {
  processCaseRecords,
}
