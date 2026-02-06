import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Series } from '@/payload-types'
import { cn } from '@/lib/utils'

interface CollectionsPreviewProps {
  collections: Series[]
  uiStrings: {
    title: string
    discoverButton: string
    noImage: string
    viewAll: string
  }
}

export const CollectionsPreview: React.FC<CollectionsPreviewProps> = ({ collections, uiStrings }) => {
  return (
    <section className="py-4 md:py-32 container mx-auto px-6 overflow-hidden">
      <div className="mb-6 md:mb-24 border-b border-primary/5 pb-8 md:pb-12 text-center md:text-left">
        <div className="max-w-xl mx-auto md:mx-0">
          <h3 className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-bold flex items-center justify-center md:justify-start gap-3">
            <span className="w-10 h-[1px] bg-accent"></span>
            {uiStrings.title}
          </h3>
          <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight">
            {uiStrings.title}
          </h2>
        </div>
      </div>

      <div className="space-y-10 md:space-y-40">
        {collections.map((collection, index) => {
          const imageUrl = typeof collection.coverImage === 'object' ? collection.coverImage?.url : null

          return (
            <div
              key={collection.id}
              className={cn(
                "flex flex-col md:items-center gap-8 md:gap-12 lg:gap-24 group",
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              )}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 relative">
                <div className="relative aspect-square overflow-hidden rounded-sm bg-secondary shadow-lg group-hover:shadow-2xl transition-all duration-700">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={collection.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/5 flex items-center justify-center">
                      <span className="text-accent/20 font-serif italic text-2xl uppercase tracking-widest">
                        {uiStrings.noImage} {index + 1}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-700" />
                </div>
              </div>

              {/* Text Section */}
              <div
                className={cn(
                  "w-full md:w-1/2 flex flex-col items-start",
                  index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right md:items-end'
                )}
              >
                <span className="text-accent font-serif italic text-base md:text-lg mb-2 md:mb-4 block">
                  Collection
                </span>
                <h4 className="text-3xl lg:text-5xl font-serif mb-2 md:mb-6 text-primary leading-tight">
                  {collection.title}
                </h4>
                {collection.description && (
                  <p
                    className={cn(
                      "text-primary/60 text-base md:text-lg font-light leading-relaxed mb-4 md:mb-10 max-w-md",
                      index % 2 === 0 ? '' : 'md:text-right'
                    )}
                  >
                    {collection.description}
                  </p>
                )}
                <Link
                  href={`/collections/${collection.slug || collection.id}`}
                  className="group/btn relative inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-primary"
                >
                  <span className="relative z-10">{uiStrings.discoverButton}</span>
                  <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:border-accent group-hover/btn:text-white transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom View All */}
      <div className="mt-4 md:mt-32 text-center pt-2 md:pt-24 border-t border-primary/5">
        <Link
          href="/collections"
          className="premium-button px-12 py-5 text-sm uppercase tracking-widest font-bold inline-block"
        >
          {uiStrings.viewAll}
        </Link>
      </div>
    </section>
  )
}
