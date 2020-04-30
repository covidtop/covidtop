import { Container } from '@material-ui/core'
import { NextPage } from 'next'

import { PageLayout } from '../components/page-layout'
import { TopSpace } from '../components/top-space'

const HomePage: NextPage = () => {
  return (
    <PageLayout headTitle='Home'>
      <TopSpace />
      <Container maxWidth={false}>
        <h2>Coming Soon</h2>
      </Container>
    </PageLayout>
  )
}

export default HomePage
