'use client'

import { ThemeProvider } from './ThemeProvider'
import Header from './Header'
import Footer from './Footer'

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
