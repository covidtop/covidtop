import { TopicSummary } from '@covidtop/shared/lib/topic'
import { getDistanceBetween } from '@covidtop/shared/lib/utils'
import { Container, NoSsr, Typography } from '@material-ui/core'
import { GetServerSideProps, NextPage } from 'next'

import { PageLayout, TopSpace } from '../../components/common'
import { apiClient, queryHelper } from '../../utils'

interface TopicPageProps {
  readonly topicId: string
  readonly topicSummary: TopicSummary
}

const getLastUpdated = (topicSummary: TopicSummary) => {
  const now = new Date()
  const result = `Last updated: ${getDistanceBetween(new Date(topicSummary.topicInfo.lastUpdated), now)} (checked 
                  ${getDistanceBetween(new Date(topicSummary.topicInfo.lastChecked), now)})`
  return result
}

const TopicPage: NextPage<TopicPageProps> = ({ topicSummary }) => {
  return (
    <PageLayout headTitle={topicSummary.topicConfig.name}>
      <TopSpace />
      <Container>
        <Typography variant='h4' gutterBottom>
          {topicSummary.topicConfig.name}
        </Typography>
        <NoSsr>
          <Typography variant='h4' gutterBottom>
            {getLastUpdated(topicSummary)}
          </Typography>
        </NoSsr>
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
