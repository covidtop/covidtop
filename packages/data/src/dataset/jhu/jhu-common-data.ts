import { DatasetConfig, MainRecord, MainRecordByLocationCode } from '@covidtop/shared/lib/dataset'
import { Location, LocationType } from '@covidtop/shared/lib/location'
import { MeasureType } from '@covidtop/shared/lib/measure'
import {
  getAllKeys,
  getDatesBetween,
  getMax,
  getMin,
  groupBy,
  keyBy,
  sumBy,
  toDateText,
} from '@covidtop/shared/lib/utils'
import axios from 'axios'
import { parse as parseDate } from 'date-fns'
import fastSort from 'fast-sort'
import neatCsv from 'neat-csv'

const baseDirUrl =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series'

const getHeaderByDate = (rows: neatCsv.Row[]): Readonly<Record<string, string>> => {
  const refDate = new Date()
  const headerByDate: Record<string, string> = {}

  getAllKeys(rows).forEach((header) => {
    try {
      const date = toDateText(parseDate(header, 'M/d/yy', refDate))
      headerByDate[date] = header
    } catch (err) {
      // Do nothing
    }
  })

  return headerByDate
}

const getMeasureByDate = (
  row: neatCsv.Row,
  dates: string[],
  headerByDate: Record<string, string>,
): Readonly<Record<string, number>> => {
  return dates.reduce((measureByDate: Record<string, number>, date) => {
    const value = row[headerByDate[date]]
    if (!value) {
      throw new Error(`No measure at date ${date}`)
    }
    measureByDate[date] = +value
    return measureByDate
  }, {})
}

export interface JhuRecord {
  readonly locations: Location[]
  readonly measureByDate: Record<string, number>
}

export interface JhuMeasureFile {
  readonly measureType: MeasureType
  readonly dates: string[]
  readonly records: JhuRecord[]
}

export const parseJhuMeasureFile = async (
  measureType: MeasureType,
  filePath: string,
  getLocations: (row: neatCsv.Row) => Location[],
): Promise<JhuMeasureFile> => {
  const fileContent = (await axios.get(`${baseDirUrl}/${filePath}`, { responseType: 'text' })).data
  const rows = await neatCsv(fileContent)

  const headerByDate: Record<string, string> = getHeaderByDate(rows)
  const dates = Object.keys(headerByDate)
  fastSort(dates).asc()

  const records: JhuRecord[] = rows.map((row) => {
    return {
      locations: getLocations(row),
      measureByDate: getMeasureByDate(row, dates, headerByDate),
    }
  })

  return {
    measureType,
    dates,
    records,
  }
}

export const getLocationByCode = (
  measureFile: JhuMeasureFile,
  locationType: LocationType,
  datasetConfig: DatasetConfig,
): Readonly<Record<string, Location>> => {
  const locationIndex = datasetConfig.locationConfig.locationTypes.findIndex(({ code }) => code === locationType.code)

  return measureFile.records.reduce((locationByCode: Record<string, Location>, record) => {
    const location = record.locations[locationIndex]
    locationByCode[location.code] = location
    return locationByCode
  }, {})
}

const getDailyMeasures = (totalMeasures: number[]): number[] => {
  return totalMeasures.reduce((currentDailyMeasures: number[], totalMeasure, dateIndex) => {
    currentDailyMeasures.push(dateIndex === 0 ? totalMeasure : totalMeasure - totalMeasures[dateIndex - 1])
    return currentDailyMeasures
  }, [])
}

const updateMainRecordsByMeasureType = (
  mainRecordByLocationCode: Record<string, MainRecord>,
  getLocationCode: (record: JhuRecord) => string,
  dates: string[],
  measureFile: JhuMeasureFile,
) => {
  Object.entries(groupBy(measureFile.records, getLocationCode)).forEach(([locationCode, groupedRecords]) => {
    const totalMeasures: number[] = dates.map((date) => {
      return sumBy(groupedRecords, (record) => record.measureByDate[date] || 0)
    })

    const mainRecord =
      mainRecordByLocationCode[locationCode] ||
      (mainRecordByLocationCode[locationCode] = {
        locationCode,
        dailyMeasures: [],
      })
    mainRecord.dailyMeasures.push(getDailyMeasures(totalMeasures))
  })
}

const groupMainRecordsByLocationType = (
  getLocationCode: (record: JhuRecord) => string,
  dates: string[],
  measureFileByType: Readonly<Record<MeasureType, JhuMeasureFile>>,
  datasetConfig: DatasetConfig,
): MainRecordByLocationCode => {
  const mainRecordByLocationCode: Record<string, MainRecord> = {}

  datasetConfig.measureConfig.measureTypes.forEach((measureType) => {
    const measureFile = measureFileByType[measureType]
    if (!measureFile) {
      throw new Error(`No measure file for ${measureType}`)
    }

    updateMainRecordsByMeasureType(mainRecordByLocationCode, getLocationCode, dates, measureFile)
  })

  return mainRecordByLocationCode
}

const getAllDates = (measureFiles: JhuMeasureFile[]): string[] => {
  const minDate = getMin(measureFiles.map(({ dates }) => dates[0]))
  const maxDate = getMax(measureFiles.map(({ dates }) => dates[dates.length - 1]))
  if (!minDate || !maxDate) {
    throw new Error('No date found')
  }
  return getDatesBetween(minDate, maxDate)
}

export interface JhuMeasureMergeResult {
  readonly dates: string[]
  readonly rootRecord: MainRecord
  readonly mainRecordByLocationTypeAndCode: Readonly<Record<string, MainRecordByLocationCode>>
}

export const mergeJhuMeasureFiles = (
  measureFiles: JhuMeasureFile[],
  rootLocation: Location,
  datasetConfig: DatasetConfig,
): JhuMeasureMergeResult => {
  const measureFileByType = keyBy(measureFiles, ({ measureType }) => measureType)
  const dates = getAllDates(measureFiles)

  const rootRecord = Object.values(
    groupMainRecordsByLocationType(() => rootLocation.code, dates, measureFileByType, datasetConfig),
  )[0]

  const mainRecordByLocationTypeAndCode = datasetConfig.locationConfig.locationTypes.reduce(
    (currentMainRecordByLocationTypeAndCode: Record<string, MainRecordByLocationCode>, locationType, locationIndex) => {
      currentMainRecordByLocationTypeAndCode[locationType.code] = groupMainRecordsByLocationType(
        ({ locations }) => locations[locationIndex].code,
        dates,
        measureFileByType,
        datasetConfig,
      )
      return currentMainRecordByLocationTypeAndCode
    },
    {},
  )

  return {
    dates,
    rootRecord,
    mainRecordByLocationTypeAndCode,
  }
}
