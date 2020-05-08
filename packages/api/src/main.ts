import 'source-map-support/register'

import { dataManager } from '@covidtop/data/lib/manager'
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'

import { AppModule } from './app-module'

export const start = async () => {
  await dataManager.refreshAllTopics({ skipIfExists: true })
  const app: INestApplication = await NestFactory.create(AppModule)
  app.use(helmet())
  await app.listen(4100)
}

if (require.main === module) {
  start().catch(console.error)
}
