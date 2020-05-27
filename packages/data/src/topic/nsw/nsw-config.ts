import { LocationType } from '@covidtop/shared/lib/location'
import { TopicConfig } from '@covidtop/shared/lib/topic'

import { globalConfig, globalLocationTypes } from '../global'

export const nswLocationTypes: Readonly<Record<string, LocationType>> = {
  localHealthDistrict: { code: 'LHD', name: 'Local Health District' },
  localGovernmentArea: { code: 'LGA', name: 'Local Government Area' },
  postcode: { code: 'POSTCODE', name: 'Postcode' },
}

export const nswConfig: TopicConfig = {
  id: 'new-south-wales',
  aliases: ['nsw'],
  name: 'Australia - New South Wales',
  links: [
    {
      topicId: globalConfig.id,
      locationTypeCode: globalLocationTypes.provinceState.code,
      locationCode: 'australia-new-south-wales',
    },
  ],
  locationConfig: {
    rootLocation: {
      type: 'STATE',
      code: 'nsw',
      name: 'New South Wales',
    },
    locationGroups: [
      {
        locationType: nswLocationTypes.localHealthDistrict,
        unknownCodes: [''],
      },
      {
        locationType: nswLocationTypes.localGovernmentArea,
        unknownCodes: [''],
      },
      {
        locationType: nswLocationTypes.postcode,
        unknownCodes: [''],
      },
    ],
  },
  measureConfig: {
    measureGroups: [
      {
        measureTypes: ['confirmed'],
        locationTypeCodes: [
          nswLocationTypes.localHealthDistrict.code,
          nswLocationTypes.localGovernmentArea.code,
          nswLocationTypes.postcode.code,
        ],
      },
    ],
  },
}
