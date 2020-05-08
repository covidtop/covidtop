import { LocationConfig } from '../location'
import { MeasureConfig } from '../measure'
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
