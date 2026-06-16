import './styles.css'
import '@/layout/Sidebar/sidebar.css'
import { Sidebar } from '@/layout/Sidebar/Sidebar'
import { Header } from '@/layout/Header/Header'
import { CreditsSlider } from '@/components/CreditsSlider/CreditsSlider'

export const metadata = {
  title: 'Deandre',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/jsc6ghr.css" />
      </head>
      <body>
        <Header />
        <div className="container-principal">
          <Sidebar />
          <main className="layout-main">
            {children}
            <CreditsSlider />
          </main>
        </div>
      </body>
    </html>
  )
}