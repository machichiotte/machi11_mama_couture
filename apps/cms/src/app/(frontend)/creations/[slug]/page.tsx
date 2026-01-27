import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { StockBadge } from '@/components/shared/StockBadge'
import { CreationGallery } from '@/components/collections/CreationGallery'
import { SiteSetting, UiString, About, Creation } from '@/payload-types'
import { ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CreationDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Find the creation by slug or ID
  const creationResponse = await payload.find({
    collection: 'creations',
    where: {
      or: [
        { slug: { equals: slug } },
        { id: { equals: slug } }
      ]
    },
    limit: 1
  })

  const creation = creationResponse.docs[0] as unknown as Creation
  if (!creation || !creation.isPublished) {
    notFound()
  }

  // Fetch Site Settings, UI Strings and About
  const siteSettings = await payload.findGlobal({ slug: 'site-settings' }) as unknown as SiteSetting
  const uiStrings = await payload.findGlobal({ slug: 'ui-strings' }) as unknown as UiString
  const about = await payload.findGlobal({ slug: 'about' }) as unknown as About

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

      <main className="py-6 md:py-12 container mx-auto px-6 flex-grow">
        {/* Breadcrumb */}
        <nav className="mb-6 md:mb-8">
          <Link 
            href="/collections" 
            className="text-[10px] uppercase tracking-widest text-primary/40 hover:text-accent transition-colors"
          >
            {uiStrings.nav?.collections || 'Collections'}
          </Link>
          <span className="mx-3 text-primary/20 text-xs">/</span>
          <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
            {creation.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="relative">
            {creation.promoLabel && creation.stockStatus !== 'hidden' && (
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-accent text-secondary px-6 py-3 shadow-2xl font-bold text-sm uppercase tracking-widest rounded-sm">
                  {creation.promoLabel}
                </div>
              </div>
            )}
            <CreationGallery images={creation.images || []} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary mb-4 leading-tight">
                {creation.title}
              </h1>
              
              {creation.stockStatus !== 'hidden' && (
                <PriceDisplay 
                  price={creation.price} 
                  promoPercentage={creation.promoPercentage || undefined}
                />
              )}
            </div>

            {creation.stockStatus !== 'hidden' && (
              <StockBadge 
                status={creation.stockStatus} 
                quantity={creation.stockQuantity}
              />
            )}

            {/* Description */}
            <div className="border-t border-primary/10 pt-6">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-primary/30 mb-3 italic">
                {uiStrings.creation?.historyLabel || 'Son histoire'}
              </h2>
              <div className="prose prose-primary max-w-none">
                <p className="text-base leading-relaxed text-primary/70 italic font-serif">
                  {/* Rich text would be better here, but matching Nuxt version for now */}
                   {typeof creation.description === 'string' ? creation.description : 'Détails à découvrir'}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="border-t border-primary/10 pt-6">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-primary/30 mb-4 italic">
                {uiStrings.creation?.detailsLabel || 'Détails'}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 text-sm text-primary/60 italic font-serif">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 flex-shrink-0" />
                  <span>{uiStrings.creation?.handMade || 'Cousu main avec passion'}</span>
                </li>
              </ul>
            </div>

            {/* Preorder Button */}
            {creation.stockStatus !== 'hidden' && (
              <div className="border-t border-primary/10 pt-6">
                <Link 
                  href={`/contact?subject=${encodeURIComponent((uiStrings.creation?.preorderButton || 'Réserver') + ': ' + creation.title)}&message=${encodeURIComponent('Bonjour, je souhaite réserver ou avoir plus d\'informations sur la création : ' + creation.title + '.')}`}
                  className="premium-button w-full text-center flex items-center justify-center gap-3 py-4 shadow-xl hover:shadow-2xl active:scale-95 transition-all group"
                >
                  <span className="text-sm uppercase tracking-[0.3em] font-bold">
                    {uiStrings.creation?.preorderButton || 'Réserver'}
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <p className="mt-3 text-[10px] text-center text-primary/30 uppercase tracking-widest font-bold">
                  {uiStrings.creation?.securityLabel || 'Paiement sécurisé et envoi soigné'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer 
        copyright={uiStrings.common?.footerCopyright || '© Mama Couture'}
        adminAccess={uiStrings.common?.adminAccess || 'Administration'}
      />
    </div>
  )
}
