import { DatasetConfig, MainData } from '@covidtop/shared/lib/dataset'
import { Location, LocationData, LocationRecord } from '@covidtop/shared/lib/location'
import dashify from 'dashify'
import neatCsv from 'neat-csv'

import { LoadData } from '../common'
import { getLocationByCode, JhuMeasureFile, mergeJhuMeasureFiles, parseJhuMeasureFile } from './jhu-common-data'
import { jhuGlobalConfig, jhuGlobalLocationTypes } from './jhu-global-config'

const getGlobalLocations = (row: neatCsv.Row): Location[] => {
  const countryRegion = row['Country/Region']
  const provinceState = row['Province/State']
  const countryRegionLocation: Location = {
    code: dashify(countryRegion),
    name: countryRegion,
  }
  const provinceStateLocation: Location = {
    code: dashify(`${countryRegion}-${provinceState}`),
    name: provinceState ? `${countryRegion} - ${provinceState}` : countryRegion,
  }
  return [countryRegionLocation, provinceStateLocation]
}

const getJhuGlobalLocationData = (measureFile: JhuMeasureFile, datasetConfig: DatasetConfig): LocationData => {
  const rootLocation: Location = {
    code: 'global',
    name: 'Global',
  }

  const countryRegionRecord: LocationRecord = {
    hasGeography: false,
    locationByCode: getLocationByCode(measureFile, jhuGlobalLocationTypes.countryRegion, datasetConfig),
  }

  const provinceStateRecord: LocationRecord = {
    hasGeography: false,
    locationByCode: getLocationByCode(measureFile, jhuGlobalLocationTypes.provinceState, datasetConfig),
  }

  return {
    rootLocation,
    locationRecordByType: {
      [jhuGlobalLocationTypes.countryRegion.code]: countryRegionRecord,
      [jhuGlobalLocationTypes.provinceState.code]: provinceStateRecord,
    },
  }
}

export const loadJhuGlobalData: LoadData = async (): Promise<MainData> => {
  const confirmedFile = await parseJhuMeasureFile(
    'confirmed',
    'time_series_covid19_confirmed_global.csv',
    getGlobalLocations,
  )
  const deathsFile = await parseJhuMeasureFile('deaths', 'time_series_covid19_deaths_global.csv', getGlobalLocations)
  const recoveredFile = await parseJhuMeasureFile(
    'recovered',
    'time_series_covid19_recovered_global.csv',
    getGlobalLocations,
  )

  const locationData = getJhuGlobalLocationData(confirmedFile, jhuGlobalConfig)

  const { dates, rootRecord, mainRecordByLocationTypeAndCode } = mergeJhuMeasureFiles(
    [confirmedFile, deathsFile, recoveredFile],
    locationData.rootLocation,
    jhuGlobalConfig,
  )

  return {
    datasetId: jhuGlobalConfig.id,
    referenceData: {
      locationData,
      dates,
    },
    rootRecord,
    mainRecordByLocationTypeAndCode,
  }
}
