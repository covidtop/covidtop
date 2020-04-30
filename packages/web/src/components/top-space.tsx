import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { FunctionComponent } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topSpace: theme.mixins.toolbar,
  }),
)

export const TopSpace: FunctionComponent = () => {
  const classes = useStyles()

  return <div className={classes.topSpace} />
}
