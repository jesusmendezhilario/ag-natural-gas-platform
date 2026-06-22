import type { Metadata } from 'next'
import { Archivo, Manrope } from 'next/font/google'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AG Natural Gas — Portal de Proyectos',
  description: 'Plataforma de gestión de proyectos para empresas de AG Natural Gas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${archivo.variable} ${manrope.variable} font-body bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}