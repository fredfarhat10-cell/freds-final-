import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from 'next/font/google'
import "./globals.css"
import { Providers } from "./providers"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"

import { env } from "@/lib/env"
import { initErrorTracking } from "@/lib/error-tracking"
import { logger } from "@/lib/logger"

// Initialize error tracking in production
if (typeof window === 'undefined') {
  // Server-side only initialization
  try {
    initErrorTracking()
    logger.info('Apex AI initialized', { 
      nodeEnv: env.NODE_ENV,
      appUrl: env.NEXT_PUBLIC_APP_URL 
    })
  } catch (error) {
    logger.error('Failed to initialize application', error as Error)
  }
}
// </CHANGE>

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "Apex AI - One AI. Infinite Possibilities.",
  description: "Your private, intelligent companion.",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={orbitron.variable}>
        <Providers>{children}</Providers>
        <Analytics />
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
