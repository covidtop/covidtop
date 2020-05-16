import { Module } from '@nestjs/common'

import { DataScheduler } from './data-scheduler'
import { TopicController } from './topic-controller'
import { TopicService } from './topic-service'

@Module({
  providers: [DataScheduler, TopicService],
  controllers: [TopicController],
})
export class DataModule {}
