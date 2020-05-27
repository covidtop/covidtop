import { Location } from '@covidtop/shared/lib/location'
import { LocationGroup, TopicData } from '@covidtop/shared/lib/topic'
import { flatMap } from '@covidtop/shared/lib/utils'

import { codeGenerator, CsvRow, locationDataHelper } from '../../source/common'
import {
  getAllDates,
  JhuMeasureFile,
  mergeJhuMeasureFiles,
  parseJhuArcgisAdmin2,
  parseJhuMeasureFile,
} from '../../source/jhu'
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

  const locationGroups: LocationGroup[] = locationDataHelper.getLocationGroups(
    flatMap([confirmedFile, deathsFile], ({ records }) => records),
    usConfig,
  )

  const dates = getAllDates([confirmedFile, deathsFile])

  return {
    rootLocation: usConfig.locationConfig.rootLocation,
    locationGroups,
    dates,
    measureGroups: [
      mergeJhuMeasureFiles(
        [confirmedFile, deathsFile],
        [usLocationTypes.state.code, usLocationTypes.county.code],
        dates,
      ),
    ],
  }
}
