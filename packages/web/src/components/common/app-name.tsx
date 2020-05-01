import { createStyles, makeStyles, Typography } from '@material-ui/core'
import { FunctionComponent } from 'react'

import { uiConstants } from './ui-constants'

const useStyles = makeStyles(() =>
  createStyles({
    appName: {
      fontFamily: '\'Righteous\', cursive',
      '& span:first-of-type': {
        color: uiConstants.color.appName1,
      },
      '& span:nth-of-type(2)': {
        color: uiConstants.color.appName2,
        marginLeft: 2,
      },
    },
  }),
)

export const AppName: FunctionComponent = () => {
  const classes = useStyles()

  return (
    <Typography variant='h5' className={classes.appName}>
      <span>Covid</span>
      <span>Top</span>
    </Typography>
  )
}
