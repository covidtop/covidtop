import { Location } from '@covidtop/shared/lib/location'
import { TopicData } from '@covidtop/shared/lib/topic'

import { codeGenerator, CsvRow, locationDataHelper } from '../../source/common'
import { JhuMeasureFile, mergeJhuMeasureFiles, parseJhuMeasureFile } from '../../source/jhu'
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
  const confirmedFile = await parseConfirmedFile()
  const deathsFile = await parseDeathsFile()
  const recoveredFile = await parseRecoveredFile()

  const { dates, locationGroups, topicRecords } = mergeJhuMeasureFiles(
    [confirmedFile, deathsFile, recoveredFile],
    globalConfig,
  )

  return {
    rootLocation: globalConfig.locationConfig.rootLocation,
    locationGroups,
    measureTypes: globalConfig.measureConfig.measureTypes,
    dates,
    topicRecords,
  }
}
