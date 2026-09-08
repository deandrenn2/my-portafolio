import './styles.css'
import '@/layout/Sidebar/sidebar.css'
import { AppShell } from '@/layout/AppShell/AppShell'

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://use.typekit.net/jsc6ghr.css" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
