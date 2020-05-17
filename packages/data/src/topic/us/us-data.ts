import { Location } from '@covidtop/shared/lib/location'
import { TopicData } from '@covidtop/shared/lib/topic'

import { codeGenerator, CsvRow, locationDataHelper } from '../../source/common'
import { JhuMeasureFile, mergeJhuMeasureFiles, parseJhuArcgisAdmin2, parseJhuMeasureFile } from '../../source/jhu'
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

const parseConfirmedFile = (): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('confirmed', 'time_series_covid19_confirmed_US.csv', getUsLocations)
}

const parseDeathsFile = (): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('deaths', 'time_series_covid19_deaths_US.csv', getUsLocations)
}

export const loadUsTopicData: LoadTopicData = async (): Promise<TopicData> => {
  const arcgisUS = await parseJhuArcgisAdmin2('US')
  const confirmedFile = await parseConfirmedFile()
  const deathsFile = await parseDeathsFile()

  const { dates, locationGroups, topicRecords } = mergeJhuMeasureFiles([confirmedFile, deathsFile], usConfig)

  return {
    rootLocation: usConfig.locationConfig.rootLocation,
    locationGroups,
    measureTypes: usConfig.measureConfig.measureTypes,
    dates,
    topicRecords,
  }
}
