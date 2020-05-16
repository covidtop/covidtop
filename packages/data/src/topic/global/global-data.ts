import { Location } from '@covidtop/shared/lib/location'
import { TopicData } from '@covidtop/shared/lib/topic'
import { IFeature } from '@esri/arcgis-rest-feature-layer'

import { arcgisApi, codeGenerator, CsvRow, locationDataHelper } from '../../source/common'
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

const parseConfirmedFile = (arcgisData: IFeature[][]): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('confirmed', 'time_series_covid19_confirmed_global.csv', getGlobalLocations, arcgisData)
}

const parseDeathsFile = (arcgisData: IFeature[][]): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('deaths', 'time_series_covid19_deaths_global.csv', getGlobalLocations, arcgisData)
}

const parseRecoveredFile = (arcgisData: IFeature[][]): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('recovered', 'time_series_covid19_recovered_global.csv', getGlobalLocations, arcgisData)
}

export const loadGlobalTopicData: LoadTopicData = async (): Promise<TopicData> => {
  const arcgisCountryRegion = await arcgisApi.getContent(
    'N9p5hsImWXAccRNI',
    'Nc2JKvYFoAEOFCG5JSI6',
    'FeatureServer',
    '2',
    {
      outFields: 'Country_Region, Confirmed as confirmed, Deaths as deaths, Recovered as recovered',
    },
  )
  const arcgisProvinceState = await arcgisApi.getContent(
    'N9p5hsImWXAccRNI',
    'Nc2JKvYFoAEOFCG5JSI6',
    'FeatureServer',
    '3',
    {
      outFields: 'Country_Region, Province_State, Confirmed as confirmed, Deaths as deaths, Recovered as recovered',
    },
  )
  const confirmedFile = await parseConfirmedFile([arcgisCountryRegion, arcgisProvinceState])
  const deathsFile = await parseDeathsFile([arcgisCountryRegion, arcgisProvinceState])
  const recoveredFile = await parseRecoveredFile([arcgisCountryRegion, arcgisProvinceState])

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
