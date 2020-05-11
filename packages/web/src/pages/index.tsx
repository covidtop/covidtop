import { TopicSummary } from '@covidtop/shared/lib/topic'
import axios from 'axios'
import { GetServerSideProps, NextPage } from 'next'

import { PageLayout, TopSpace } from '../components/common'
import { TopicList } from '../components/home/topic-list'

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
  const topicSummaries = (await axios.get<TopicSummary[]>('http://api:4100/topics')).data

  return {
    props: {
      topicSummaries,
    },
  }
}

export default HomePage
