import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Feestjepakken — Vind je uitjesmaatje',
  description:
    'Niemand om mee te gaan? Vind iemand die net zo graag uitgaat als jij. Techno, theater, festival, concert — voor elk uitje is een maatje te vinden.',
  openGraph: {
    title: 'Feestjepakken',
    description: 'Vind je uitjesmaatje voor techno, theater, festival en meer.',
    url: 'https://feestjepakken.nl',
    siteName: 'Feestjepakken',
    locale: 'nl_NL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
