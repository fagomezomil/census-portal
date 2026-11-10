import type { Metadata } from "next"
import { Roboto, Roboto_Mono } from "next/font/google"
import "./globals.css"

const roboto = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Dirección de Estadística de la Provincia - Tucumán",
  description:
    "Portal de datos estadísticos de la Provincia de Tucumán. Indicadores económicos, publicaciones, datasets y más.",
  keywords: [
    "estadística",
    "Tucumán",
    "IPC",
    "desocupación",
    "pobreza",
    "indicadores",
    "DEP",
    "censo",
    "datos abiertos",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}