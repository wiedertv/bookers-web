import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/theme.styled'
import '../styles/globals.css'
import {AuthProvider} from "../contexts/web3Authentication.contexts";

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <AuthProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
  </AuthProvider>

  )
}

export default MyApp
