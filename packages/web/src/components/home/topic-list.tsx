import { TopicSummary } from '@covidtop/shared/lib/topic'
import { Card, CardContent, Container, createStyles, Link, makeStyles, Theme, Typography } from '@material-ui/core'
import PageLink from 'next/link'
import { FunctionComponent } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topicCard: {
      marginBottom: theme.spacing(2),
    },
  }),
)

export interface TopicCardProps {
  readonly topicSummary: TopicSummary
}

export const TopicCard: FunctionComponent<TopicCardProps> = ({ topicSummary }) => {
  const { topicConfig, locationGroupSummaries } = topicSummary
  const classes = useStyles()

  return (
    <PageLink href='/topics/[topicId]' as={`/topics/${topicConfig.id}`}>
      <Link href={`/topics/${topicConfig.id}`} underline='none'>
        <Card className={classes.topicCard}>
          <CardContent>
            <Typography variant='h5' gutterBottom>
              {topicConfig.name}
            </Typography>
            {locationGroupSummaries.map((locationGroupSummary) => (
              <Typography variant='body2' key={locationGroupSummary.locationType.code}>
                {locationGroupSummary.locationType.name}: {locationGroupSummary.lengthOfLocations}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Link>
    </PageLink>
  )
}

export interface TopicListProps {
  readonly topicSummaries: TopicSummary[]
}

export const TopicList: FunctionComponent<TopicListProps> = ({ topicSummaries }) => {
  return (
    <Container>
      {topicSummaries.map((topicSummary) => (
        <TopicCard key={topicSummary.topicConfig.id} topicSummary={topicSummary} />
      ))}
    </Container>
  )
}
