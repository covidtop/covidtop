import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { blueGrey } from '@material-ui/core/colors'
import { AppProps } from 'next/app'
import { useEffect } from 'react'

import { uiConstants } from '../components/ui-constants'

const useRemoveSsrInjectedCssEffect = () => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])
}

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
  },
  overrides: {
    MuiAppBar: {
      root: {
        boxShadow: 'none',
      },
    },
    MuiCardContent: {
      root: {
        padding: 16,
        '&:last-child': {
          paddingBottom: 16,
        },
      },
    },
    MuiTableCell: {
      root: {
        padding: 8,
      },
    },
    MuiOutlinedInput: {
      input: {
        padding: uiConstants.inputPadding,
      },
    },
  },
})

const AppLayout = ({ Component, pageProps }: AppProps) => {
  useRemoveSsrInjectedCssEffect()

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default AppLayout
