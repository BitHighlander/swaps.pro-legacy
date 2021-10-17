import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { translations } from 'assets/translations'
import { WalletProvider } from 'context/WalletProvider/WalletProvider'
import React from 'react'
import { I18n } from 'react-polyglot'
import { BrowserRouter } from 'react-router-dom'
import { theme } from 'theme/theme'

const locale: string = navigator?.language?.split('-')[0] ?? 'en'
const messages = translations[locale]

type ProvidersProps = {
  children: React.ReactNode
}

export function AppProviders({ children }: ProvidersProps) {
  return (
      <ChakraProvider theme={theme}>
        <ColorModeScript />
          <BrowserRouter>
            <I18n locale={locale} messages={messages}>
              <WalletProvider>
                {children}
              </WalletProvider>
            </I18n>
          </BrowserRouter>
      </ChakraProvider>
  )
}
