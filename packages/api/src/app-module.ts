import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { DataModule } from './data'
import { WebhookModule } from './webhook'

@Module({
  imports: [ScheduleModule.forRoot(), DataModule, WebhookModule],
})
export class AppModule {}
