import { Location } from '@covidtop/shared/lib/location'
import { TopicData } from '@covidtop/shared/lib/topic'
import { IFeature } from '@esri/arcgis-rest-feature-layer'

import { arcgisApi, codeGenerator, CsvRow, locationDataHelper } from '../../source/common'
import { JhuMeasureFile, mergeJhuMeasureFiles, parseJhuMeasureFile } from '../../source/jhu'
import { LoadTopicData } from '../common'
import { usConfig, usLocationTypes } from './us-config'

const getUsLocations = (row: CsvRow): Location[] => {
  const state = row.Province_State
  const stateLocation: Location = {
    type: usLocationTypes.state.code,
    code: codeGenerator.getCodeFromName(state),
    name: state,
  }

  const county = row.Admin2
  const countyName = county ? `${state} - ${county}` : state
  const countyLocation: Location = {
    type: usLocationTypes.county.code,
    code: codeGenerator.getCodeFromName(countyName),
    name: countyName,
  }

  return locationDataHelper.normaliseLocations([stateLocation, countyLocation], usConfig)
}

const parseConfirmedFile = (arcgisData: IFeature[][]): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('confirmed', 'time_series_covid19_confirmed_US.csv', getUsLocations, arcgisData)
}

const parseDeathsFile = (arcgisData: IFeature[][]): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('deaths', 'time_series_covid19_deaths_US.csv', getUsLocations, arcgisData)
}

export const loadUsTopicData: LoadTopicData = async (): Promise<TopicData> => {
  const arcgisUS = await arcgisApi.getContent('N9p5hsImWXAccRNI', 'Nc2JKvYFoAEOFCG5JSI6', 'FeatureServer', '1', {
    where: 'Country_Region = \'US\'',
    outFields: 'Province_State, Admin2, Confirmed as confirmed, Deaths as deaths',
  })
  const confirmedFile = await parseConfirmedFile([arcgisUS])
  const deathsFile = await parseDeathsFile([arcgisUS])

  const { dates, locationGroups, topicRecords } = mergeJhuMeasureFiles([confirmedFile, deathsFile], usConfig)

  return {
    rootLocation: usConfig.locationConfig.rootLocation,
    locationGroups,
    measureTypes: usConfig.measureConfig.measureTypes,
    dates,
    topicRecords,
  }
}
