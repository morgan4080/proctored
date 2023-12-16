import '@/styles/globals.scss'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import Script from 'next/script'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Loader from '@/components/Loader'
import NProgress from 'nprogress'

NProgress.configure({showSpinner: false});
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        Router.events.on("routeChangeStart", (url)=>{
            setIsLoading(true)
            NProgress.start()
        });

        Router.events.on("routeChangeComplete", (url)=>{
            setIsLoading(false)
            NProgress.done(false)
        });

        Router.events.on("routeChangeError", (url) =>{
            setIsLoading(false)
        });

    }, [Router])
  return (
    <>
        <Script src="https://fw-cdn.com/11081366/3816148.js"></Script>
        <SessionProvider session={session}>
            {isLoading && <Loader/>}
            <Component {...pageProps} />
        </SessionProvider>
    </>
  )
}
