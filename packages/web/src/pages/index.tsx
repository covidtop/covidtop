import { TopicSummary } from '@covidtop/shared/lib/topic'
import { GetServerSideProps, NextPage } from 'next'

import { PageLayout, TopSpace } from '../components/common'
import { TopicList } from '../components/home/topic-list'
import { apiClient } from '../utils/api-client'

interface HomePageProps {
  readonly topicSummaries: TopicSummary[]
}

const HomePage: NextPage<HomePageProps> = ({ topicSummaries }) => {
  return (
    <PageLayout headTitle='Home'>
      <TopSpace />
      <TopicList topicSummaries={topicSummaries} />
    </PageLayout>
  )
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const topicSummaries = (await apiClient.get<TopicSummary[]>('/topics')).data

  return {
    props: {
      topicSummaries,
    },
  }
}

export default HomePage
