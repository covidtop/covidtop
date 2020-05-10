import { TopicId } from '@covidtop/shared/lib/topic'
import { keyBy } from '@covidtop/shared/lib/utils'

import { TopicLoader } from './common'
import { globalLoader } from './global'
import { nswLoader } from './nsw'
import { usLoader } from './us'

export const allTopicLoaders: TopicLoader[] = [globalLoader, usLoader, nswLoader]

export const topicLoaderById: Readonly<Record<TopicId, TopicLoader>> = keyBy(
  allTopicLoaders,
  ({ topicConfig }) => topicConfig.id,
)
