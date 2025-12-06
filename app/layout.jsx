import AuthProvider from './components/auth/authprovider'
import './globals.css'
import Header from '../app/components/Header/page'
import Footer from './components/Footer/page'



export const metadata = {
  title: 'My App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      
      
      <AuthProvider>
        

        

        <body>
          <Header />
          
          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {children}
          </main>
          
        <Footer />

          
        </body>

       
      </AuthProvider>
      

    </html>
  )
}
