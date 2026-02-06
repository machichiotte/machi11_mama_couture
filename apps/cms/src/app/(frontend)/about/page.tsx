import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Image from 'next/image'
import { Mail, Instagram, Facebook, Link as LinkIcon } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RichText } from '@/components/shared/RichText'
import { SiteSetting, UiString, About as AboutType } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const payload = await getPayload({ config })

  const siteSettings = await payload.findGlobal({ slug: 'site-settings' }) as unknown as SiteSetting
  const uiStrings = await payload.findGlobal({ slug: 'ui-strings' }) as unknown as UiString
  const about = await payload.findGlobal({ slug: 'about' }) as unknown as AboutType

  const profileImageUrl = typeof about.profileImage === 'object' ? about.profileImage?.url : null

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

      <main className="flex-grow py-4 md:py-10 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start md:items-center">
          {/* Image Section */}
          <div className="relative w-full max-w-xl mx-auto aspect-square bg-secondary/50 overflow-hidden rounded-sm border border-primary/5 shadow-lg">
            <div className="absolute inset-0 bg-accent/5 z-10" />
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={uiStrings.about?.imageAlt || 'About Mama Couture'}
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary/20 bg-secondary">
                <span className="font-serif italic text-lg">
                  {uiStrings.about?.imageAlt || 'Image à venir'}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-col">
            <h2 className="text-accent text-sm uppercase tracking-[0.2em] mb-2 font-semibold flex items-center gap-4">
              <span className="w-8 h-[1px] bg-accent" />
              {uiStrings.about?.badge || 'Artisane'}
            </h2>

            <h1 className="text-4xl lg:text-5xl font-serif mb-6 text-primary leading-tight">
              {about.name || uiStrings.about?.defaultTitle || 'À propos'}
            </h1>

            <RichText
              content={about.bio}
              className="prose prose-lg text-primary/80 font-light leading-relaxed mb-4 md:mb-6 max-w-none"
            />

            <div className="border-t border-primary/10 pt-4 md:pt-6 mt-4 md:mt-6 bg-primary/5 p-4 md:p-6 rounded-sm">
              <h4 className="font-serif text-2xl italic text-primary mb-4 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-accent" />
                <span>{uiStrings.common?.contactTitle || 'Me contacter'}</span>
              </h4>

              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${about.contactEmail}`}
                  className="group flex items-center gap-4 text-primary/80 hover:text-accent transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="font-medium tracking-wide text-lg pb-0.5 border-b border-transparent group-hover:border-accent">
                    {about.contactEmail}
                  </span>
                </a>

                {about.socialLinks && about.socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {about.socialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-5 py-3 bg-secondary/50 backdrop-blur-sm border border-primary/10 rounded-sm hover:border-accent/50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        {social.platform.toLowerCase().includes('instagram') ? (
                          <Instagram className="h-5 w-5 text-accent" />
                        ) : social.platform.toLowerCase().includes('facebook') ? (
                          <Facebook className="h-5 w-5 text-accent" />
                        ) : (
                          <LinkIcon className="h-5 w-5 text-accent" />
                        )}
                        <span className="uppercase text-xs font-bold tracking-widest text-primary/80 group-hover:text-primary">
                          {social.platform}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
