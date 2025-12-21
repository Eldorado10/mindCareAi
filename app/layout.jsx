import './globals.css'
import ClientLayout from './components/ClientLayout'

export const metadata = {
  title: 'MindCare AI - Mental Health Companion',
  description: 'Your supportive companion for mental wellness and professional care',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
