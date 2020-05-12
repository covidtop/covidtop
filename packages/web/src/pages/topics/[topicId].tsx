import { TopicSummary } from '@covidtop/shared/lib/topic'
import { Container, Typography } from '@material-ui/core'
import { GetServerSideProps, NextPage } from 'next'

import { PageLayout, TopSpace } from '../../components/common'
import { queryHelper } from '../../utils'
import { apiClient } from '../../utils/api-client'

interface TopicPageProps {
  readonly topicId: string
  readonly topicSummary: TopicSummary
}

const TopicPage: NextPage<TopicPageProps> = ({ topicSummary }) => {
  return (
    <PageLayout headTitle={topicSummary.topicConfig.name}>
      <TopSpace />
      <Container>
        <Typography variant='h4' gutterBottom>
          {topicSummary.topicConfig.name}
        </Typography>
      </Container>
    </PageLayout>
  )
}

export const getServerSideProps: GetServerSideProps<TopicPageProps> = async ({ query }) => {
  const topicId = queryHelper.getValue(query.topicId)

  if (!topicId) {
    throw new Error('No topicId')
  }

  const topicSummary = (await apiClient.get<TopicSummary>(`/topics/${topicId}`)).data

  return {
    props: {
      topicId,
      topicSummary,
    },
  }
}

export default TopicPage
