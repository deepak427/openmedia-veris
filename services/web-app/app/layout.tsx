import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'
import RightSidebar from '@/components/RightSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Veris - Truth Matters',
  description: 'AI-powered fact-checking platform. Verify claims, combat misinformation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex min-h-screen bg-white">
          <Sidebar />
          <main className="flex-1 border-r border-neutral-200 pb-20 md:pb-0 overflow-y-auto md:ml-[244px] lg:mr-[320px]">
            {children}
          </main>
          <RightSidebar />
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
