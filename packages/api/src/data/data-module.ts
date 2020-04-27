import { Module } from '@nestjs/common'

import { DataScheduler } from './data-scheduler'

@Module({
  providers: [DataScheduler],
})
export class DataModule {}
