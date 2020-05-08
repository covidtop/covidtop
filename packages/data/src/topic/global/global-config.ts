import { TopicConfig } from '@covidtop/shared/lib/topic'

export const globalLocationTypes = {
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
    locationTypes: [globalLocationTypes.countryRegion, globalLocationTypes.provinceState],
  },
  measureConfig: {
    measureTypes: ['confirmed', 'deaths', 'recovered'],
  },
}
