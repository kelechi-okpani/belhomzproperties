import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import Footer from '@/components/Layout/footer';
import Navbar from '@/components/Layout/navigation';
import { Providers } from '@/dashboard/utils/providers';


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Luxury Real Estate | Premium Properties',
  description: 'Discover exclusive luxury properties and investment opportunities',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.webp',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo.webp',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo.webp',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.webp',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
       <div>
         <Navbar />
         <Providers>{children}</Providers>
         {/* {children} */}
         <Footer />
       </div>
  )
}
