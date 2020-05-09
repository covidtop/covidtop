import { Location } from '@covidtop/shared/lib/location'
import { TopicData } from '@covidtop/shared/lib/topic'

import { sourceHelper } from '../../source/common'
import { JhuMeasureFile, mergeJhuMeasureFiles, parseJhuMeasureFile } from '../../source/jhu'
import { LoadTopicData } from '../common'
import { usConfig, usLocationTypes } from './us-config'

const getUsLocations = (row: Record<string, string>): Location[] => {
  const state = row.Province_State
  const county = row.Admin2
  const stateLocation: Location = {
    type: usLocationTypes.state.code,
    code: sourceHelper.getCodeFromName(state),
    name: state,
  }
  const countyName = county ? `${state} - ${county}` : state
  const countyLocation: Location = {
    type: usLocationTypes.county.code,
    code: sourceHelper.getCodeFromName(countyName),
    name: countyName,
  }
  return [stateLocation, countyLocation]
}

const parseConfirmedFile = (): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('confirmed', 'time_series_covid19_confirmed_US.csv', getUsLocations)
}

const parseDeathsFile = (): Promise<JhuMeasureFile> => {
  return parseJhuMeasureFile('deaths', 'time_series_covid19_deaths_US.csv', getUsLocations)
}

export const loadUsTopicData: LoadTopicData = async (): Promise<TopicData> => {
  const confirmedFile = await parseConfirmedFile()
  const deathsFile = await parseDeathsFile()

  const { locationGroups, dates, topicRecords } = mergeJhuMeasureFiles([confirmedFile, deathsFile], usConfig)

  return {
    rootLocation: usConfig.locationConfig.rootLocation,
    locationGroups,
    measureTypes: usConfig.measureConfig.measureTypes,
    dates,
    topicRecords,
  }
}
