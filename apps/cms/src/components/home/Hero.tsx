'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Media } from '@/payload-types'

interface HeroProps {
  siteTitle: string
  tagline?: string
  description?: string
  buttonLabel: string
  heroImage?: string | Media
}

export const Hero: React.FC<HeroProps> = ({
  siteTitle,
  tagline,
  description,
  buttonLabel,
  heroImage,
}) => {
  const imageUrl = typeof heroImage === 'object' ? heroImage?.url : heroImage
  const altText = typeof heroImage === 'object' ? (heroImage?.alt || 'Atelier Couture') : 'Atelier Couture'

  return (
    <section className="relative h-[65vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-secondary transition-colors duration-500">
      <div className="absolute inset-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover opacity-30 dark:opacity-100 transition-opacity duration-500"
            priority
          />
        )}
        <div className="absolute inset-0 bg-transparent dark:bg-black/60 transition-colors duration-500" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight text-primary drop-shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          {siteTitle}
        </h1>
        <h2 className="text-lg uppercase tracking-[0.3em] text-primary mb-8 font-bold">
          {tagline}
        </h2>
        {description && (
          <p className="text-xl text-primary/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {description}
          </p>
        )}
        <Link
          href="/collections"
          className="premium-button text-lg px-10 py-4 font-medium transition-all duration-500 inline-block"
        >
          {buttonLabel}
        </Link>
      </motion.div>
    </section>
  )
}
