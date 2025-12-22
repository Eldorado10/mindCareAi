import './globals.css'
import ClientLayout from './components/ClientLayout'

export const metadata = {
  title: 'MindCare AI - Mental Health Companion',
  description: 'Your supportive companion for mental wellness and professional care',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-primary)] focus:outline-none shadow-sm"
        >
          Skip to main content
        </a>
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="absolute inset-0 bg-[var(--bg-gradient)] opacity-90" aria-hidden />
          <div
            className="pointer-events-none absolute inset-x-0 top-[-20%] h-72 bg-gradient-to-br from-[rgba(91,139,245,0.28)] via-[rgba(157,113,232,0.24)] to-[rgba(76,215,182,0.18)] blur-3xl"
            aria-hidden
          />
          <div className="relative z-10">
            <ClientLayout>
              <div id="main-content" className="flex-1 flex flex-col">
                {children}
              </div>
            </ClientLayout>
          </div>
        </div>
      </body>
    </html>
  )
}
