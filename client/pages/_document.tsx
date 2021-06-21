import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <title>CodeFreezing</title>
          <meta property="og:title" content="CodeFreezing" />
          <meta
            property="og:description"
            content="Save your code and share it."
          />
          <meta
            property="og:image"
            content="https://via.placeholder.com/1200x630/6C63FF/ffffff?text=CodeFreezing"
          />
          <link
            rel="preload"
            href="/fonts/NotoSans/NotoSans-Regular.woff2"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/NotoSans/NotoSans-Regular.woff"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/NotoSans/NotoSans-Bold.woff2"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/NotoSans/NotoSans-Bold.woff"
            as="font"
            crossOrigin=""
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
