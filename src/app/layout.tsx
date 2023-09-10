import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import App from './App';
import { ClerkProvider } from '@clerk/nextjs';
import {dark} from "@clerk/themes";
import ConvexClientProvider from './ConvexClientProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Castle Doors Treasure!!',
  description: 'Its a game to search for the treasures in different castles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <ClerkProvider  
        appearance={{
          baseTheme: dark
        }}
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <App>
            <html lang="en">
              <head>
                <link rel="shortcut icon" href="/favicon.ico" />
              </head>
              <body className={inter.className}>
                <ConvexClientProvider>
                  {children}
                </ConvexClientProvider>
              </body>
            </html>
          </App>
      </ClerkProvider>
  )
}
