import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { StockBadge } from '@/components/shared/StockBadge'
import { SiteSetting, UiString, About, Series, Creation } from '@/payload-types'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Find the series by slug or ID
  const collectionResponse = await payload.find({
    collection: 'series',
    where: {
      or: [
        { slug: { equals: slug } },
        { id: { equals: slug } }
      ]
    },
    limit: 1
  })

  const collection = collectionResponse.docs[0] as unknown as Series
  if (!collection || !collection.isPublished) {
    notFound()
  }

  // Fetch Site Settings, UI Strings and About
  const siteSettings = await payload.findGlobal({ slug: 'site-settings' }) as unknown as SiteSetting
  const uiStrings = await payload.findGlobal({ slug: 'ui-strings' }) as unknown as UiString
  const about = await payload.findGlobal({ slug: 'about' }) as unknown as About

  // Fetch creations for this collection
  const creationsResponse = await payload.find({
    collection: 'creations',
    where: {
      series: { equals: collection.id },
      isPublished: { equals: true }
    },
    limit: 100
  })
  const creations = creationsResponse.docs as unknown as Creation[]

  const coverImageUrl = typeof collection.coverImage === 'object' ? collection.coverImage?.url : null

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        siteTitle={siteSettings.siteTitle}
        navStrings={{
          collections: uiStrings.nav?.collections || 'Collections',
          about: uiStrings.nav?.about || 'À propos',
          contact: uiStrings.nav?.contact || 'Contact',
          menuLabel: uiStrings.nav?.menuLabel || 'Menu',
        }}
        socialLinks={about.socialLinks || []}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <header className="h-[40vh] md:h-[60vh] relative flex items-center justify-center overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-40">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={collection.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-accent/20" />
            )}
          </div>

          <div className="relative z-10 text-center px-6 max-w-4xl">
            <h1 className="text-secondary text-4xl md:text-7xl font-serif mb-4 md:mb-6 leading-tight">
              {collection.title}
            </h1>
            <p className="text-secondary/80 text-lg md:text-xl italic font-light max-w-2xl mx-auto">
              {collection.description}
            </p>
          </div>
        </header>

        {/* Creations Grid */}
        <section className="container mx-auto px-6 py-10 md:py-20">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-primary/5 pb-8">
            <div>
              <h2 className="text-accent text-sm uppercase tracking-widest mb-2 font-bold">
                {uiStrings.collections?.portfolioLabel || 'Portfolio'}
              </h2>
              <p className="text-3xl font-serif text-primary">
                {uiStrings.collections?.piecesTitle || 'Pièces uniques'}
              </p>
            </div>
            <div className="text-primary/40 text-sm italic mt-4 md:mt-0 font-serif">
              {creations.length} {uiStrings.collections?.uniqueCreationsLabel || 'créations uniques'}
            </div>
          </div>

          {creations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
              {creations.map((creation) => {
                const mainImage = creation.images?.[0]?.image
                const creationImageUrl = typeof mainImage === 'object' ? mainImage?.url : null

                return (
                  <Link
                    key={creation.id}
                    href={`/creations/${creation.slug || creation.id}`}
                    className="group block cursor-pointer"
                  >
                    <article className="h-full flex flex-col">
                      <div className="relative aspect-square overflow-hidden bg-secondary/50 mb-4 rounded-sm shadow-md group-hover:shadow-2xl transition-all duration-500 border border-primary/5 group-hover:-translate-y-2">

                        {/* Promo Label */}
                        {creation.promoLabel && (
                          <div className="absolute top-0 right-0 z-20">
                            <div className="bg-accent text-secondary px-4 py-2 shadow-xl font-bold text-xs uppercase tracking-widest rounded-bl-sm">
                              {creation.promoLabel}
                            </div>
                          </div>
                        )}

                        {/* Creation Image */}
                        {creationImageUrl ? (
                          <Image
                            src={creationImageUrl}
                            alt={creation.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full border border-primary/5 flex items-center justify-center text-primary/20">
                            <span className="text-xs uppercase tracking-widest font-sans">
                              {uiStrings.collections?.noImage || 'Image à venir'}
                            </span>
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/0 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Status Badge */}
                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                          <StockBadge
                            status={creation.stockStatus}
                            quantity={creation.stockQuantity}
                          />
                        </div>

                        {/* Price */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <PriceDisplay
                            price={creation.price}
                            promoPercentage={creation.promoPercentage || undefined}
                          />
                        </div>
                      </div>

                      {/* Name & Short Description */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl font-serif mb-2 text-primary group-hover:text-accent transition-colors text-center leading-tight">
                          {creation.title}
                        </h3>
                        {/* We use a simple CSS class for line clamp here */}
                        <p className="text-primary/60 text-sm italic font-serif leading-relaxed text-center line-clamp-2">
                          {/* Rich text extraction or simple description string */}
                          {typeof creation.description === 'string' ? creation.description : 'Détails à découvrir'}
                        </p>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-32 bg-secondary/50 rounded-sm border border-dashed border-primary/10">
              <p className="text-primary/40 font-serif italic text-lg">
                {uiStrings.collections?.emptyCollection || 'Cette collection est en cours de création.'}
              </p>
              <Link
                href="/contact"
                className="inline-block mt-6 text-accent hover:text-primary transition-colors font-medium border-b border-accent"
              >
                {uiStrings.collections?.inquiryLink || 'Me contacter'}
              </Link>
            </div>
          )}

          {/* Back Button */}
          <nav className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-primary/5 flex justify-center">
            <Link
              href="/collections"
              className="text-primary hover:text-accent font-medium tracking-widest text-sm uppercase flex items-center group transition-all"
            >
              <span className="mr-3 transform group-hover:-translate-x-2 transition-transform duration-300">←</span>
              {uiStrings.collections?.backToAll || 'Toutes les collections'}
            </Link>
          </nav>
        </section>
      </main>

      <Footer
        copyright={uiStrings.common?.footerCopyright || '© Mama Couture'}
        adminAccess={uiStrings.common?.adminAccess || 'Administration'}
      />
    </div>
  )
}
