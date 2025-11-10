import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // simple persisted theme
    const mode = localStorage.getItem('theme') || 'dark'
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [])
  return <Component {...pageProps} />
}
