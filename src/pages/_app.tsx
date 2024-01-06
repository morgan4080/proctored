import '@/styles/globals.scss'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import Script from 'next/script'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <>
        <Script src="https://fw-cdn.com/11081366/3816148.js"></Script>
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    </>
  )
}
