import { MeasureType } from '@covidtop/shared/lib/measure'
import { MeasureGroup, MeasureGroupRecord } from '@covidtop/shared/lib/topic'
import { getDatesBetween, getMax, getMin } from '@covidtop/shared/lib/utils'

import { locationDataHelper } from '../common'
import { JhuMeasureFile } from './jhu-measure-file'
import { JhuRecord } from './jhu-record'

export const getAllDates = (measureFiles: JhuMeasureFile[]): string[] => {
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

const getMeasureGroupRecord = (
  measureGroupRecordByLocationKey: Record<string, MeasureGroupRecord>,
  jhuRecord: JhuRecord,
  locationTypeCodes: string[],
  dates: string[],
  lengthOfMeasures: number,
): MeasureGroupRecord => {
  const locationKey = locationDataHelper.getLocationKey(jhuRecord, locationTypeCodes)

  const existingMeasureGroupRecord: MeasureGroupRecord | undefined = measureGroupRecordByLocationKey[locationKey]
  if (existingMeasureGroupRecord) {
    return existingMeasureGroupRecord
  }

  const measureGroupRecord: MeasureGroupRecord = {
    locationCodePerType: locationDataHelper.getLocationCodes(jhuRecord, locationTypeCodes),
    measurePerTypeAndDate: Array.from({ length: lengthOfMeasures }).map(() => {
      return dates.map(() => 0)
    }),
  }

  measureGroupRecordByLocationKey[locationKey] = measureGroupRecord

  return measureGroupRecord
}

const getMeasureGroupRecords = (
  measureFiles: JhuMeasureFile[],
  locationTypeCodes: string[],
  dates: string[],
): MeasureGroupRecord[] => {
  const measureGroupRecordByLocationKey: Record<string, MeasureGroupRecord> = {}

  measureFiles.forEach((measureFile, measureIndex) => {
    measureFile.records.forEach((record) => {
      const measureGroupRecord = getMeasureGroupRecord(
        measureGroupRecordByLocationKey,
        record,
        locationTypeCodes,
        dates,
        measureFiles.length,
      )
      measureGroupRecord.measurePerTypeAndDate[measureIndex] = getValuePerDate(record, dates)
    })
  })

  return Object.values(measureGroupRecordByLocationKey)
}

export const mergeJhuMeasureFiles = (
  measureFiles: JhuMeasureFile[],
  locationTypeCodes: string[],
  dates: string[],
): MeasureGroup => {
  const measureTypes: MeasureType[] = measureFiles.map(({ measureType }) => measureType)

  const measureGroupRecords: MeasureGroupRecord[] = getMeasureGroupRecords(measureFiles, locationTypeCodes, dates)

  return {
    measureTypes,
    locationTypeCodes,
    records: measureGroupRecords,
  }
}
