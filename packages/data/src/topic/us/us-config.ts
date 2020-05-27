import { LocationType } from '@covidtop/shared/lib/location'
import { TopicConfig } from '@covidtop/shared/lib/topic'

import { globalConfig, globalLocationTypes } from '../global'

export const usLocationTypes: Readonly<Record<string, LocationType>> = {
  state: { code: 'STATE', name: 'State' },
  county: { code: 'COUNTY', name: 'County' },
}

export const usConfig: TopicConfig = {
  id: 'us',
  aliases: ['usa'],
  name: 'US',
  links: [
    {
      topicId: globalConfig.id,
      locationTypeCode: globalLocationTypes.countryRegion.code,
      locationCode: 'us',
    },
  ],
  locationConfig: {
    rootLocation: {
      type: 'COUNTRY',
      code: 'us',
      name: 'US',
    },
    locationGroups: [
      {
        locationType: usLocationTypes.state,
      },
      {
        locationType: usLocationTypes.county,
      },
    ],
  },
  measureConfig: {
    measureGroups: [
      {
        measureTypes: ['confirmed', 'deaths'],
        locationTypeCodes: [usLocationTypes.state.code, usLocationTypes.county.code],
      },
    ],
  },
}
