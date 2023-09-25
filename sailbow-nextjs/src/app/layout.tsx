import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from './ClientProviders'
import ServerProviders from './ServerProviders'
import { RedirectToSignIn, SignIn, SignedIn, SignedOut } from '@clerk/nextjs'
import NavBar from './_components/NavBar'

export const metadata: Metadata = {
  title: 'Sailbow',
  description: 'Sailbow Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ServerProviders>
          <ClientProviders>
            <SignedIn>
              <NavBar/>
              {children}
            </SignedIn>
            <SignedOut>
              <SignIn />
            </SignedOut>
          </ClientProviders>
        </ServerProviders>
      </body>
    </html>
  )
}
