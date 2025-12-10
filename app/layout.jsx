import './globals.css'
import Header from '../app/components/Header'
import Footer from './components/Footer'

export const metadata = {
  title: 'MindCare AI - Mental Health Companion',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  )
}
