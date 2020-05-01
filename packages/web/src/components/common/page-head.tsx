import Head from 'next/head'
import { FunctionComponent } from 'react'

export interface PageHeadProps {
  readonly title: string
}

const PageMeta: FunctionComponent = () => {
  return (
    <>
      <meta name='apple-mobile-web-app-title' content='CovidTop' />
      <meta name='application-name' content='CovidTop' />
      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='theme-color' content='#607d8b' />
      <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
    </>
  )
}

const PageLink: FunctionComponent = () => {
  return (
    <>
      <link
        rel='stylesheet'
        href='https://fonts.googleapis.com/css2?family=Righteous&family=Roboto:wght@300;400;500;700&display=swap'
      />
      <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
      <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
      <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
      <link rel='manifest' href='/site.webmanifest' />
      <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#607d8b' />
    </>
  )
}

export const PageHead: FunctionComponent<PageHeadProps> = ({ title }) => {
  return (
    <Head>
      <PageMeta />
      <PageLink />
      <title>{title} | CovidTop</title>
    </Head>
  )
}
