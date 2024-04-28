import '@/styles/globals.scss'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import Script from 'next/script'
import Loader from "@/components/Loader";
import {useEffect, useState} from "react";
import {Router} from "next/router";
import NProgress from "nprogress";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";

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
          <Script src="https://embed.tawk.to/65a818438d261e1b5f548a32/1hkc9tj37"></Script>
          <Script src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`}></Script>
          <SessionProvider session={session}>
              {isLoading && <Loader/>}
              <PayPalScriptProvider
                  options={{
                      clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`,
                      currency: 'USD',
                      intent: 'capture'
                  }}
              >
              <Component {...pageProps} />
              </PayPalScriptProvider>
          </SessionProvider>
      </>
  )
}
