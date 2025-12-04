import AuthProvider from './components/auth/authprovider'
import './globals.css'



export const metadata = {
  title: 'My App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      
      
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
      

    </html>
  )
}
