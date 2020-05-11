import { Location } from '@covidtop/shared/lib/location'
import { MeasureType } from '@covidtop/shared/lib/measure'
import { addDate, fastSort, parseDate, toDateText } from '@covidtop/shared/lib/utils'
import { IFeature } from '@esri/arcgis-rest-feature-layer'

import { CsvRow, gitHubApi, parseCsvFile } from '../common'
import { JhuMeasureFile } from './jhu-measure-file'
import { JhuRecord } from './jhu-record'

const getHeaderByDate = (headers: string[]): Readonly<Record<string, string>> => {
  const refDate = new Date()
  const headerByDate: Record<string, string> = {}

  headers.forEach((header) => {
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
  row: CsvRow,
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
  getLocations: (row: CsvRow) => Location[],
  [arcgisMain, arcgisSub]: IFeature[][],
): Promise<JhuMeasureFile> => {
  const fileContent = await gitHubApi.getContent(
    'CSSEGISandData',
    'COVID-19',
    `csse_covid_19_data/csse_covid_19_time_series/${filePath}`,
  )
  const { headers, rows } = await parseCsvFile(fileContent)
  const headerByDate: Record<string, string> = getHeaderByDate(headers)
  const dates = Object.keys(headerByDate)
  fastSort(dates).asc()
  const currentDate = dates[dates.length - 1]
  const nextDate = addDate(currentDate, 1)
  const mergedRows = rows.map((row: Record<string, string>) => {
    const locationKey = row.Province_State
      ? [row.Province_State, row.Admin2].join('$')
      : [row['Country/Region'], row['Province/State']].join('$')
    const arcgisRows = row.Province_State
      ? arcgisMain
      : row['Country/Region'] && row['Province/State']
        ? arcgisSub
        : arcgisMain
    const foundArcgisRow = arcgisRows.find(({ attributes }) => {
      const arcgisLocationKey = row.Province_State
        ? [attributes.Province_State, attributes.Admin2].join('$')
        : [attributes.Country_Region, attributes.Province_State].join('$')
      return locationKey === arcgisLocationKey
    })
    if (foundArcgisRow) {
      const value = foundArcgisRow.attributes[measureType]
      if (value > row[headerByDate[currentDate]]) {
        if (dates[dates.length - 1] !== nextDate) {
          dates.push(nextDate)
          headerByDate[nextDate] = nextDate
        }
        row[nextDate] = value
      }
    }
    return row
  })

  const records: JhuRecord[] = mergedRows.map((mergedRow: Record<string, string>) => {
    const row = mergedRow[headerByDate[dates[dates.length - 1]]]
      ? mergedRow
      : { ...mergedRow, [dates[dates.length - 1]]: mergedRow[headerByDate[currentDate]] }
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
