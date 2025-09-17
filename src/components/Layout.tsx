import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from 'sonner'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export default function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: '#374151',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </div>
  )
}