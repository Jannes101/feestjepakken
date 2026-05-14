import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Feestjepakken — Vind je uitjesmaatje',
  description: 'Niemand om mee te gaan? Vind iemand die net zo graag uitgaat als jij. Techno, theater, festival, concert — voor elk uitje is een maatje te vinden.',
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
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
