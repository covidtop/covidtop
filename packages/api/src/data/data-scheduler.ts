import { dataManager } from '@covidtop/data/lib/manager'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class DataScheduler {
  @Cron(CronExpression.EVERY_15_MINUTES)
  async triggerRefreshData () {
    await dataManager.refreshAllTopics({ skipIfExists: false })
  }
}
