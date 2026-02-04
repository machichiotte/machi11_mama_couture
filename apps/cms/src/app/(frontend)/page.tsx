import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { CollectionsPreview } from '@/components/home/CollectionsPreview'
import { SiteSetting, UiString, About, Series } from '@/payload-types'

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Fetch Globals
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
  }) as unknown as SiteSetting

  const uiStrings = await payload.findGlobal({
    slug: 'ui-strings',
  }) as unknown as UiString

  const about = await payload.findGlobal({
    slug: 'about',
  }) as unknown as About

  // Fetch Collections (Series)
  const collections = await payload.find({
    collection: 'series',
    where: {
      isPublished: {
        equals: true,
      },
    },
    limit: 4,
    sort: 'order',
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

      <main className="flex-grow">
        <Hero
          siteTitle={siteSettings.siteTitle}
          tagline={siteSettings.tagline || ''}
          description={siteSettings.meta?.description || ''}
          buttonLabel={uiStrings.hero?.exploreButton || 'Découvrir'}
          heroImage={siteSettings.heroImage || undefined}
        />

        <CollectionsPreview
          collections={collections.docs as unknown as Series[]}
          uiStrings={{
            title: uiStrings.collections?.title || 'Collections',
            discoverButton: uiStrings.collections?.discoverButton || 'Découvrir',
            noImage: uiStrings.collections?.noImage || 'Image à venir',
            viewAll: uiStrings.collections?.viewAll || 'Tout voir',
          }}
        />
      </main>

      <Footer
        copyright={uiStrings.common?.footerCopyright || '© Atelier Petit Point'}
        adminAccess={uiStrings.common?.adminAccess || 'Administration'}
      />
    </div>
  )
}
