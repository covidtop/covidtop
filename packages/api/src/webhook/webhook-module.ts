import { Module } from '@nestjs/common'

import { ChatService } from './chat'
import { WatsonController } from './watson'

@Module({
  controllers: [WatsonController],
  providers: [ChatService],
})
export class WebhookModule {}
