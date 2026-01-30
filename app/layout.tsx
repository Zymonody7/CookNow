import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '马上开饭 - CookNow',
  description: '根据现有食材，智能生成美味菜谱',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN'>
      <body>{children}</body>
    </html>
  )
}
