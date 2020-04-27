import { DatasetConfig } from '@covidtop/shared/lib/dataset'

export const jhuGlobalLocationTypes = {
  countryRegion: { code: 'L1', name: 'Country/Region' },
  provinceState: { code: 'L2', name: 'Province/State' },
}

export const jhuGlobalConfig: DatasetConfig = {
  id: 'jhu-global',
  name: 'Johns Hopkins University CSSE - Global Data',
  locationConfig: {
    locationTypes: [jhuGlobalLocationTypes.countryRegion, jhuGlobalLocationTypes.provinceState],
  },
  measureConfig: {
    measureTypes: ['confirmed', 'deaths', 'recovered'],
  },
}
