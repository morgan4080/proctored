import { Html, Head, Main, NextScript } from 'next/document'
import NProgress from 'nprogress';

NProgress.configure({showSpinner: false});
export default function Document() {
  return (
    <Html lang="en">
    <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
              integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
              crossOrigin="anonymous" referrerPolicy="no-referrer"/>
    </Head>
      <body className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 relative">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
