import React from 'react'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata = {
  description: 'Atelier Petit Point - Créations artisanales uniques',
  title: 'Atelier Petit Point',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="fr" className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-secondary text-primary">
        {children}
      </body>
    </html>
  )
}
