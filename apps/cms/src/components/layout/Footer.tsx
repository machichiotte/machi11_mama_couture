import React from 'react'
import Link from 'next/link'

interface FooterProps {
  copyright: string
  adminAccess: string
}

export const Footer: React.FC<FooterProps> = ({ copyright, adminAccess }) => {
  return (
    <footer className="bg-primary/5 border-t border-primary/5 py-4 md:py-6">
      <div className="container mx-auto px-6 text-center space-y-2">
        <p className="text-xs text-primary/40 italic font-serif">
          {copyright}
        </p>
        <Link 
          href="/admin" 
          className="inline-block text-[10px] text-primary/10 hover:text-accent/40 font-serif italic transition-colors"
        >
          {adminAccess}
        </Link>
      </div>
    </footer>
  )
}
