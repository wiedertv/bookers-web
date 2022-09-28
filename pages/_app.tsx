import { MoralisProvider } from 'react-moralis'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/theme.styled'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <MoralisProvider
    appId={process.env.NEXT_PUBLIC_APP_ID || ''}
    serverUrl={process.env.NEXT_PUBLIC_SERVER_URL || ''}
    >
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
  </MoralisProvider>
  )
}

export default MyApp
