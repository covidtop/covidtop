import { ServerStyleSheets } from '@material-ui/core'
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

class DocumentLayout extends Document {
  render () {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

DocumentLayout.getInitialProps = async (ctx: DocumentContext) => {
  // Collect and inject Css
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage
  ctx.renderPage = () => {
    return originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })
  }
  const initialProps: DocumentInitialProps = await Document.getInitialProps(ctx)
  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  }
}

export default DocumentLayout
