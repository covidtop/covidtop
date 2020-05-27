import { LocationConfig } from './location-config'
import { MeasureConfig } from './measure-config'
import { TopicId } from './topic-id'
import { TopicLink } from './topic-link'

export interface TopicConfig {
  readonly id: TopicId
  readonly aliases: string[]
  readonly name: string
  readonly links: TopicLink[]
  readonly locationConfig: LocationConfig
  readonly measureConfig: MeasureConfig
}
