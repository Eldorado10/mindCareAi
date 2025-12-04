import './globals.css'
import { SessionProvider } from "next-auth/react"


export const metadata = {
  title: 'My App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
