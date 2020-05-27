import { Location } from '@covidtop/shared/lib/location'
import { TopicData } from '@covidtop/shared/lib/topic'

import { caseDataHelper, CaseRecord, ckanApi, CsvRow, locationDataHelper, parseCsvFile } from '../../source/common'
import { LoadTopicData } from '../common'
import { nswConfig, nswLocationTypes } from './nsw-config'

const getNswLocations = (row: CsvRow): Location[] => {
  const lhdLocation: Location = {
    type: nswLocationTypes.localHealthDistrict.code,
    code: row.lhd_2010_code,
    name: row.lhd_2010_name,
  }

  const lgaLocation: Location = {
    type: nswLocationTypes.localGovernmentArea.code,
    code: row.lga_code19,
    name: row.lga_name19,
  }

  const postcodeLocation: Location = {
    type: nswLocationTypes.postcode.code,
    code: row.postcode,
    name: row.postcode,
  }

  return locationDataHelper.normaliseLocations([lhdLocation, lgaLocation, postcodeLocation], nswConfig)
}

export const loadNswTopicData: LoadTopicData = async (): Promise<TopicData> => {
  const fileContent = await ckanApi.getDatasetContent('https://data.nsw.gov.au', 'covid-19-cases-by-location', 'CSV')
  const { rows } = await parseCsvFile(fileContent)

  const caseRecords: CaseRecord[] = rows.map((row) => {
    return {
      locations: getNswLocations(row),
      date: row.notification_date,
    }
  })

  const { locationGroups, dates, measureGroupRecords } = caseDataHelper.processCaseRecords(caseRecords, nswConfig)

  return {
    rootLocation: nswConfig.locationConfig.rootLocation,
    locationGroups,
    dates,
    measureGroups: [
      {
        measureTypes: ['confirmed'],
        locationTypeCodes: locationGroups.map(({ locationType }) => locationType.code),
        records: measureGroupRecords,
      },
    ],
  }
}
