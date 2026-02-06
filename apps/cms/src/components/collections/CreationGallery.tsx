'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface CreationGalleryProps {
  images: {
    image: string | Media
    id?: string | null
  }[]
}

export const CreationGallery: React.FC<CreationGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-secondary/50 rounded-sm flex items-center justify-center border border-primary/5">
        <span className="text-primary/20 font-serif italic text-lg">Aucune image</span>
      </div>
    )
  }

  const mainImage = images[activeIndex].image
  const mainImageUrl = typeof mainImage === 'object' ? mainImage?.url : null

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary rounded-sm border border-primary/5 shadow-lg">
        {mainImageUrl ? (
          <Image
            src={mainImageUrl}
            alt="Détail de la création"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-all duration-700"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/20 bg-secondary">
            <span className="font-serif italic">Image indisponible</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {images.map((img, idx) => {
            const thumbUrl = typeof img.image === 'object' ? img.image?.url : null
            if (!thumbUrl) return null

            return (
              <button
                key={img.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-sm border-2 transition-all duration-300",
                  activeIndex === idx ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={thumbUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 15vw"
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
