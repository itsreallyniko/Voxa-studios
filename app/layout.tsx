import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Nav } from '@/components/nav'
import { TourModalProvider } from '@/lib/tour-modal-context'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Voxa Studios — Luxury Creative Showroom',
  description: 'Record podcasts, VSLs, and content in professionally designed studio environments.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} dark`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@200,0..1&display=swap"
        />
      </head>
      <body className="bg-obsidian text-ivory antialiased">
        <TourModalProvider>
          <Nav />
          {children}
        </TourModalProvider>
      </body>
    </html>
  )
}
