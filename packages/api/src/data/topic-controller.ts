import { TopicSummary } from '@covidtop/shared/lib/topic'
import { Controller, Get, NotFoundException, Param } from '@nestjs/common'

import { TopicService } from './topic-service'

@Controller('topics')
export class TopicController {
  constructor (private readonly topicService: TopicService) {}

  @Get()
  getTopicSummaries (): TopicSummary[] {
    return this.topicService.getTopicSummaries()
  }

  @Get(':topicId')
  getTopicSummary (@Param('topicId') topicId: string): TopicSummary {
    const topicSummary: TopicSummary | undefined = this.topicService.getTopicSummary(topicId)

    if (!topicSummary) {
      throw new NotFoundException()
    }

    return topicSummary
  }
}
