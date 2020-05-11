import { TopicSummary } from '@covidtop/shared/lib/topic'
import { Card, CardContent, Container, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
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
  const classes = useStyles()

  return (
    <Card className={classes.topicCard}>
      <CardContent>
        <Typography variant='h5' gutterBottom>
          {topicSummary.topicConfig.name}
        </Typography>
        {topicSummary.locationGroupSummaries.map((locationGroupSummary) => (
          <Typography variant='body2' key={locationGroupSummary.locationType.code}>
            {locationGroupSummary.locationType.name}: {locationGroupSummary.lengthOfLocations}
          </Typography>
        ))}
      </CardContent>
    </Card>
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
