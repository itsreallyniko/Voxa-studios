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

const SITE_URL = 'https://voxastudios.com'
const TITLE = 'Voxa Studios — Podcast & Content Studio in Tampa, FL'
const DESCRIPTION =
  "Tampa's turnkey podcast and content studio. Multi-cam recording, studio lighting, audio, and on-site producer included — from $300 / 90 min."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Voxa Studios',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Voxa Studios — Tampa podcast and content studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/hero.jpg'],
  },
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
