import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'

import { AppModule } from './app-module'

export const start = async () => {
  const port = process.env.API_PORT
  if (!port) {
    throw new Error('API_PORT is undefined')
  }
  const app: INestApplication = await NestFactory.create(AppModule)
  app.use(helmet())
  await app.listen(+port)
}

if (require.main === module) {
  start().catch(console.error)
}
