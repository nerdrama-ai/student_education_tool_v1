import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // add dark class by default
    document.documentElement.classList.add('dark')
  }, [])
  return <Component {...pageProps} />
}
export default MyApp
