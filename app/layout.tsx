import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'
import { WebSocketProvider } from '@/contexts/websocket-context'
import RouteGuard from '@/components/auth/route-guard'
import './globals.css'

export const metadata: Metadata = {
  title: 'WhatsApp Suite - Gestão Completa',
  description: 'Plataforma completa para gestão e automação do WhatsApp',
  generator: 'WhatsApp Suite',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
* {
  font-family: ${GeistSans.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}
        `}</style>
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`} style={{ fontFamily: GeistSans.style.fontFamily }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <WebSocketProvider organizationId={1} enabled={true}>
              <RouteGuard>
                {children}
              </RouteGuard>
            </WebSocketProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
