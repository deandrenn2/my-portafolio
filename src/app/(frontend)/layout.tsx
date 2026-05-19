import './styles.css'
import { Sidebar } from '@/layout/Sidebar/Sidebar'
import { Header } from '@/layout/Header/Header'
import { CreditsSlider } from '@/components/CreditsSlider/CreditsSlider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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