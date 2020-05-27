import { Location } from '@covidtop/shared/lib/location'
import { LocationGroup, TopicData } from '@covidtop/shared/lib/topic'
import { flatMap } from '@covidtop/shared/lib/utils'

import { codeGenerator, CsvRow, locationDataHelper } from '../../source/common'
import {
  getAllDates,
  JhuMeasureFile,
  mergeJhuMeasureFiles,
  parseJhuArcgisCountryRegion,
  parseJhuArcgisProvinceState,
  parseJhuMeasureFile,
} from '../../source/jhu'
import { LoadTopicData } from '../common'
import { globalConfig, globalLocationTypes } from './global-config'

const getGlobalLocations = (row: CsvRow): Location[] => {
  const countryRegion = row['Country/Region']
  const countryRegionLocation: Location = {
    type: globalLocationTypes.countryRegion.code,
    code: codeGenerator.getCodeFromName(countryRegion),
    name: countryRegion,
  }

  const provinceState = row['Province/State']
  const provinceStateName = provinceState ? `${countryRegion} - ${provinceState}` : countryRegion
  const provinceStateLocation: Location = {
    type: globalLocationTypes.provinceState.code,
    code: codeGenerator.getCodeFromName(provinceStateName),
    name: provinceStateName,
  }

  return locationDataHelper.normaliseLocations([countryRegionLocation, provinceStateLocation], globalConfig)
}

const parseConfirmedFile = (): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('confirmed', 'time_series_covid19_confirmed_global.csv', getGlobalLocations)
}

const parseDeathsFile = (): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('deaths', 'time_series_covid19_deaths_global.csv', getGlobalLocations)
}

const parseRecoveredFile = (): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('recovered', 'time_series_covid19_recovered_global.csv', getGlobalLocations)
}

export const loadGlobalTopicData: LoadTopicData = async (): Promise<TopicData> => {
  const arcgisCountryRegion = await parseJhuArcgisCountryRegion()
  const arcgisProvinceState = await parseJhuArcgisProvinceState()
  const confirmedFile = await parseConfirmedFile()
  const deathsFile = await parseDeathsFile()
  const recoveredFile = await parseRecoveredFile()

  const locationGroups: LocationGroup[] = locationDataHelper.getLocationGroups(
    flatMap([confirmedFile, deathsFile, recoveredFile], ({ records }) => records),
    globalConfig,
  )

  const dates = getAllDates([confirmedFile, deathsFile, recoveredFile])

  return {
    rootLocation: globalConfig.locationConfig.rootLocation,
    locationGroups,
    dates,
    measureGroups: [
      mergeJhuMeasureFiles(
        [confirmedFile, deathsFile],
        [globalLocationTypes.countryRegion.code, globalLocationTypes.stateProvince.code],
        dates,
      ),
      mergeJhuMeasureFiles([recoveredFile], [globalLocationTypes.countryRegion.code], dates),
    ],
  }
}
