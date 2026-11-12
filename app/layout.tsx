import { Geist, Geist_Mono, Manrope, Space_Mono } from "next/font/google"

import "./globals.css"
import { AppChrome } from "@/components/app-chrome"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const manrope = Manrope({ subsets: ["latin"], variable: "--font-display" })

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-echo",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        manrope.variable,
        spaceMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>
      </body>
    </html>
  )
}
