import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import { Toaster } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { Inter as FontSans } from 'next/font/google'

import '@/styles/globals.css'
import '@uploadthing/react/styles.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'Breaddit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={cn(
        'min-h-screen bg-background font-sans antialiased text-slate-900 light',
        fontSans.className
      )}
    >
      <body className='min-h-screen pt-12 bg-slate-50 antialiased'>
        <Providers>
          <Navbar />

          {authModal}

          <div className='container max-w-7xl mx-auto h-full pt-12'>
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
