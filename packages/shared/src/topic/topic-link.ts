import { TopicId } from './topic-id'

export interface TopicLink {
  readonly topicId: TopicId
  readonly locationTypeCode: string
  readonly locationCode: string
}
