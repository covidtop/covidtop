import { Location } from '@covidtop/shared/lib/location'
import { MeasureType } from '@covidtop/shared/lib/measure'
import { getAllKeys, parseDate, toDateText } from '@covidtop/shared/lib/utils'
import axios from 'axios'
import fastSort from 'fast-sort'
import neatCsv from 'neat-csv'

import { JhuMeasureFile } from './jhu-measure-file'
import { JhuRecord } from './jhu-record'

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

const getTotalByDate = (
  row: neatCsv.Row,
  dates: string[],
  headerByDate: Record<string, string>,
): Readonly<Record<string, number>> => {
  return dates.reduce((totalByDate: Record<string, number>, date) => {
    const total = row[headerByDate[date]]
    if (!total) {
      throw new Error(`Date ${date} has no total`)
    }
    totalByDate[date] = +total
    return totalByDate
  }, {})
}

export const parseJhuMeasureFile = async (
  measureType: MeasureType,
  filePath: string,
  getLocations: (row: Record<string, string>) => Location[],
): Promise<JhuMeasureFile> => {
  const fileContent = (await axios.get(`${baseDirUrl}/${filePath}`, { responseType: 'text' })).data
  const rows = await neatCsv(fileContent)

  const headerByDate: Record<string, string> = getHeaderByDate(rows)
  const dates = Object.keys(headerByDate)
  fastSort(dates).asc()

  const records: JhuRecord[] = rows.map((row) => {
    return {
      locations: getLocations(row),
      totalByDate: getTotalByDate(row, dates, headerByDate),
    }
  })

  return {
    measureType,
    dates,
    records,
  }
}
