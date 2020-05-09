import { TopicConfig } from '@covidtop/shared/lib/topic'

import { globalConfig, globalLocationTypes } from '../global'

export const usLocationTypes = {
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
    locationTypes: [usLocationTypes.state, usLocationTypes.county],
  },
  measureConfig: {
    measureTypes: ['confirmed', 'deaths'],
  },
}
