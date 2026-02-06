import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SiteSetting, UiString, About, Series } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function CollectionsPage() {
  const payload = await getPayload({ config })

  const siteSettings = await payload.findGlobal({ slug: 'site-settings' }) as unknown as SiteSetting
  const uiStrings = await payload.findGlobal({ slug: 'ui-strings' }) as unknown as UiString
  const about = await payload.findGlobal({ slug: 'about' }) as unknown as About

  const collections = await payload.find({
    collection: 'series',
    where: {
      isPublished: {
        equals: true,
      },
    },
    sort: 'order',
    limit: 100,
  })

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

      <main className="py-12 md:py-24 container mx-auto px-6 flex-grow">
        <header className="max-w-3xl mb-12 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-serif mb-6 md:mb-8 leading-tight text-primary">
            {uiStrings.collections?.title || 'Collections'}
          </h1>
          <div className="w-20 h-1 bg-accent mb-6 md:mb-8" />
          <p className="text-primary/60 text-xl leading-relaxed font-light italic">
            {uiStrings.collections?.description || ''}
          </p>
        </header>

        {collections.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-10 md:gap-y-16">
            {collections.docs.map((collection: Series, index: number) => {
              const imageUrl = typeof collection.coverImage === 'object' ? collection.coverImage?.url : null

              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug || collection.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative aspect-square overflow-hidden mb-4 md:mb-8 bg-secondary/50 rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-primary/5">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={collection.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent/5 flex items-center justify-center">
                        <span className="text-accent/20 font-serif italic text-2xl uppercase tracking-widest">
                          {uiStrings.collections?.noImage || 'Image à venir'} No. {index + 1}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />

                    {/* Badge Explorer */}
                    <div className="absolute bottom-10 left-10 right-10 flex justify-center items-center">
                      <span className="premium-button text-xs px-8 py-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-xl">
                        {uiStrings.collections?.exploreLabel || 'Explorer'}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-3xl font-serif mb-3 text-primary group-hover:text-accent transition-colors duration-300">
                    {collection.title}
                  </h2>
                  <p className="text-primary/40 font-light italic leading-relaxed line-clamp-2 max-w-lg">
                    {collection.description}
                  </p>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-secondary/50 rounded-lg border border-dashed border-primary/10">
            <p className="text-primary/40 font-serif text-2xl italic">
              {uiStrings.collections?.noCollections || 'Aucune collection trouvée'}
            </p>
            <Link
              href="/contact"
              className="inline-block mt-8 premium-button px-10"
            >
              {uiStrings.collections?.notifyMe || 'Me prévenir'}
            </Link>
          </div>
        )}
      </main>

      <Footer
        copyright={uiStrings.common?.footerCopyright || '© Mama Couture'}
        adminAccess={uiStrings.common?.adminAccess || 'Administration'}
      />
    </div>
  )
}
