import { Location, LocationGroup } from '@covidtop/shared/lib/location'
import { TopicConfig } from '@covidtop/shared/lib/topic'

export const UNKNOWN_LOCATION_CODE = 'UNKNOWN'

const normaliseLocations = (locations: Location[], topicConfig: TopicConfig): Location[] => {
  const { locationConfig } = topicConfig

  return locations.map((location) => {
    if (locationConfig.unknownCodes && locationConfig.unknownCodes.includes(location.code)) {
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

const getLocationCodes = (itemWithLocations: HasLocations): string[] => {
  return itemWithLocations.locations.map(({ code }) => code)
}

const getLocationKey = (itemWithLocations: HasLocations): string => {
  return getLocationCodes(itemWithLocations).join('$')
}

const getLocationGroups = (records: HasLocations[], topicConfig: TopicConfig): LocationGroup[] => {
  return topicConfig.locationConfig.locationTypes.map(
    (locationType, locationIndex): LocationGroup => {
      const locationByCode: Record<string, Location> = {}
      records.forEach((record) => {
        const location = record.locations[locationIndex]
        locationByCode[location.code] = location
      })

      return {
        locationType,
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
