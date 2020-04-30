import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { FunctionComponent } from 'react'

import { PageHead } from './page-head'
import { TopAppBar } from './top-app-bar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageLayout: {
      display: 'flex',
    },
    mainContent: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      paddingBottom: theme.spacing(3),
    },
  }),
)

export interface PageLayoutProps {
  readonly headTitle: string
}

export const PageLayout: FunctionComponent<PageLayoutProps> = ({ headTitle, children }) => {
  const classes = useStyles()

  return (
    <div className={classes.pageLayout}>
      <PageHead title={headTitle} />
      <TopAppBar />
      <main className={classes.mainContent}>{children}</main>
    </div>
  )
}
