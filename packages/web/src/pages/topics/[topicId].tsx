import { TopicInfo, TopicSummary } from '@covidtop/shared/lib/topic'
import { getDistanceToNow } from '@covidtop/shared/lib/utils'
import { Container, NoSsr, Typography } from '@material-ui/core'
import { GetServerSideProps, NextPage } from 'next'
import React, { FunctionComponent } from 'react'

import { PageLayout, TopSpace } from '../../components/common'
import { apiClient, queryHelper } from '../../utils'

interface TopicPageProps {
  readonly topicId: string
  readonly topicSummary: TopicSummary
}

interface TopicLastUpdatedProps {
  readonly topicInfo: TopicInfo
}

const TopicLastUpdated: FunctionComponent<TopicLastUpdatedProps> = ({ topicInfo }) => {
  return (
    <>
      {`Last updated: ${getDistanceToNow(topicInfo.lastUpdated)}`}{' '}
      {topicInfo.lastUpdated !== topicInfo.lastChecked && `(checked ${getDistanceToNow(topicInfo.lastChecked)})`}
    </>
  )
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
          <TopicLastUpdated topicInfo={topicSummary.topicInfo} />
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
