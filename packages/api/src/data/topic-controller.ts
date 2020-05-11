import { TopicSummary } from '@covidtop/shared/lib/topic'
import { Controller, Get } from '@nestjs/common'

import { TopicService } from './topic-service'

@Controller('topics')
export class TopicController {
  constructor (private readonly topicService: TopicService) {}

  @Get()
  getTopicSummaries (): TopicSummary[] {
    return this.topicService.getTopicSummaries()
  }
}
