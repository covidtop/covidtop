import { LocationType } from '@covidtop/shared/lib/location'
import { TopicConfig } from '@covidtop/shared/lib/topic'

export const globalLocationTypes: Readonly<Record<string, LocationType>> = {
  countryRegion: { code: 'L1', name: 'Country/Region' },
  provinceState: { code: 'L2', name: 'Province/State' },
}

export const globalConfig: TopicConfig = {
  id: 'global',
  aliases: ['world'],
  name: 'Global',
  links: [],
  locationConfig: {
    rootLocation: {
      type: 'GLOBAL',
      code: 'global',
      name: 'Global',
    },
    locationGroups: [
      {
        locationType: globalLocationTypes.countryRegion,
      },
      {
        locationType: globalLocationTypes.provinceState,
      },
    ],
  },
  measureConfig: {
    measureGroups: [
      {
        measureTypes: ['confirmed', 'deaths'],
        locationTypeCodes: [globalLocationTypes.countryRegion.code, globalLocationTypes.provinceState.code],
      },
      {
        measureTypes: ['recovered'],
        locationTypeCodes: [globalLocationTypes.countryRegion.code],
      },
    ],
  },
}
