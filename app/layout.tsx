import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Organizador Financeiro AI',
  description: 'Organize suas finanças com IA - Converte áudio em dados estruturados',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        <div className="min-h-screen flex items-center justify-center p-4">
          {children}
        </div>
      </body>
    </html>
  )
}
