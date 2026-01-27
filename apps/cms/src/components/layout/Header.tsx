'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Instagram, Facebook, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
}

interface HeaderProps {
  siteTitle: string
  navStrings: {
    collections: string
    about: string
    contact: string
    menuLabel: string
  }
  socialLinks?: {
    platform: string
    url: string
  }[]
}

export const Header: React.FC<HeaderProps> = ({ siteTitle, navStrings, socialLinks }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const pathname = usePathname()

  useEffect(() => {
    // Initial theme
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = stored || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const navItems: NavItem[] = [
    { to: '/collections', label: navStrings.collections },
    { to: '/about', label: navStrings.about },
    { to: '/contact', label: navStrings.contact },
  ]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-[100] border-b border-primary/5 transition-all duration-300',
        isScrolled || isMenuOpen ? 'bg-secondary' : 'bg-secondary/80 backdrop-blur-md'
      )}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center relative z-[120]">
        <Link href="/" className="group">
          <h1 className="text-2xl font-serif font-bold tracking-tight text-primary group-hover:text-accent transition-colors">
            {siteTitle}
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-10 items-center">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                'text-xs uppercase tracking-[0.2em] font-bold text-primary/60 hover:text-primary transition-all relative py-1 group',
                pathname.startsWith(item.to) && '!text-accent !text-opacity-100'
              )}
            >
              {item.label}
              <span
                className={cn(
                  'absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full',
                  pathname.startsWith(item.to) && 'w-full'
                )}
              />
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary/5 transition-all duration-300 group"
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gold group-hover:rotate-12 transition-transform duration-300" />
            ) : (
              <Moon className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:-rotate-12 transition-all duration-300" />
            )}
          </button>
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary/5 transition-all duration-300"
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 text-gold" />
            ) : (
              <Moon className="h-6 w-6 text-primary/60" />
            )}
          </button>

          <button
            className="text-primary p-2 -mr-2 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">{navStrings.menuLabel}</span>
            {isMenuOpen ? (
              <X className="h-7 w-7 transition-all duration-300 rotate-90" />
            ) : (
              <Menu className="h-7 w-7 transition-all duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-secondary z-[110] flex flex-col pt-32 px-10 h-screen w-screen overflow-hidden"
          >
            <nav className="flex flex-col space-y-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    href={item.to}
                    className={cn(
                      'text-4xl font-serif text-primary hover:text-accent transition-colors',
                      pathname.startsWith(item.to) && 'text-accent'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-20">
                <p className="text-xs uppercase tracking-[0.3em] font-bold text-primary/30 mb-6">
                  Suivez-nous
                </p>
                <div className="flex flex-wrap gap-6">
                  {socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-colors">
                        {social.platform.toLowerCase().includes('instagram') ? (
                          <Instagram className="h-5 w-5 text-accent" />
                        ) : social.platform.toLowerCase().includes('facebook') ? (
                          <Facebook className="h-5 w-5 text-accent" />
                        ) : (
                          <LinkIcon className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <span className="text-[10px] items-center uppercase tracking-widest font-bold text-primary/60 group-hover:text-primary transition-colors">
                        {social.platform}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
