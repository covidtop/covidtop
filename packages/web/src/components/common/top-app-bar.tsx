import { AppBar, Toolbar } from '@material-ui/core'
import { FunctionComponent } from 'react'

import { AppName } from './app-name'

export const TopAppBar: FunctionComponent = () => {
  return (
    <AppBar color='transparent' position='absolute'>
      <Toolbar>
        <AppName />
      </Toolbar>
    </AppBar>
  )
}
