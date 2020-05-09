import { getAllKeys } from '@covidtop/shared/lib/utils'
import fastSort from 'fast-sort'
import neatCsv from 'neat-csv'

export type CsvRow = Readonly<Record<string, string>>

export interface CsvFile {
  readonly headers: string[]
  readonly rows: CsvRow[]
}

export const parseCsvFile = async (fileContent: string): Promise<CsvFile> => {
  const rows = await neatCsv(fileContent)
  const headers = getAllKeys(rows)
  fastSort(headers)

  return {
    headers,
    rows,
  }
}
