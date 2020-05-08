import { TopicId } from '@covidtop/shared/lib/topic'
import { keyBy } from '@covidtop/shared/lib/utils'

import { TopicLoader } from './common'
import { globalLoader } from './global'

export const allTopicLoaders: TopicLoader[] = [globalLoader]

export const topicLoaderById: Readonly<Record<TopicId, TopicLoader>> = keyBy(
  allTopicLoaders,
  ({ topicConfig }) => topicConfig.id,
)
