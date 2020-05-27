import { Location } from '@covidtop/shared/lib/location'
import { LocationGroup, TopicConfig } from '@covidtop/shared/lib/topic'

export const UNKNOWN_LOCATION_CODE = 'UNKNOWN'

const normaliseLocations = (locations: Location[], topicConfig: TopicConfig): Location[] => {
  return locations.map((location, locationIndex) => {
    const locationGroupConfig = topicConfig.locationConfig.locationGroups[locationIndex]
    if (locationGroupConfig.unknownCodes && locationGroupConfig.unknownCodes.includes(location.code)) {
      return {
        ...location,
        code: UNKNOWN_LOCATION_CODE,
        name: 'Unknown',
      }
    }

    return location
  })
}

export interface HasLocations {
  readonly locations: Location[]
}

const getLocationCodes = (itemWithLocations: HasLocations, locationTypeCodes?: string[]): string[] => {
  if (locationTypeCodes) {
    return locationTypeCodes.map((locationTypeCode) => {
      const locationOfType = itemWithLocations.locations.find(({ type }) => type === locationTypeCode)
      if (!locationOfType) {
        throw new Error(`No location of type: ${locationTypeCode}`)
      }
      return locationOfType.code
    })
  }
  return itemWithLocations.locations.map(({ code }) => code)
}

const getLocationKey = (itemWithLocations: HasLocations, locationTypeCodes?: string[]): string => {
  return getLocationCodes(itemWithLocations, locationTypeCodes).join('$')
}

const getLocationGroups = (records: HasLocations[], topicConfig: TopicConfig): LocationGroup[] => {
  return topicConfig.locationConfig.locationGroups.map(
    (locationGroupConfig, locationIndex): LocationGroup => {
      const locationByCode: Record<string, Location> = {}
      records.forEach((record) => {
        const location = record.locations[locationIndex]
        locationByCode[location.code] = location
      })

      return {
        locationType: locationGroupConfig.locationType,
        locationByCode,
      }
    },
  )
}

export const locationDataHelper = {
  normaliseLocations,
  getLocationCodes,
  getLocationKey,
  getLocationGroups,
}
