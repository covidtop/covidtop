import { dataManager } from '@covidtop/data/lib/manager'
import { LocationGroup, LocationGroupSummary } from '@covidtop/shared/lib/location'
import { TopicHolder, TopicSummary } from '@covidtop/shared/lib/topic'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TopicService {
  getTopicSummaries (): TopicSummary[] {
    return dataManager.getTopicHolders().map((topicHolder) => this.mapToTopicSummary(topicHolder))
  }

  getTopicSummary (topicId: string): TopicSummary | undefined {
    const topicHolder = dataManager.getTopicHolders().find(({ topicConfig }) => topicConfig.id === topicId)

    if (!topicHolder) {
      return
    }

    return this.mapToTopicSummary(topicHolder)
  }

  private mapToTopicSummary (topicHolder: TopicHolder): TopicSummary {
    const { topicConfig, topicInfo, topicData } = topicHolder

    return {
      topicConfig,
      topicInfo,
      minDate: topicData.dates[0],
      maxDate: topicData.dates[topicData.dates.length - 1],
      locationGroupSummaries: topicData.locationGroups.map((locationGroup) =>
        this.mapToLocationGroupSummary(locationGroup),
      ),
    }
  }

  private mapToLocationGroupSummary (locationGroup: LocationGroup): LocationGroupSummary {
    const { locationType, locationByCode } = locationGroup

    return {
      locationType,
      lengthOfLocations: Object.keys(locationByCode).length,
    }
  }
}
