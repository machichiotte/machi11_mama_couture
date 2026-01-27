import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from './ContactForm'
import { SiteSetting, UiString, About } from '@/payload-types'

interface PageProps {
  searchParams: Promise<{
    message?: string
    subject?: string
  }>
}

export default async function ContactPage({ searchParams }: PageProps) {
  const { message, subject } = await searchParams
  const payload = await getPayload({ config })

  const siteSettings = await payload.findGlobal({ slug: 'site-settings' }) as unknown as SiteSetting
  const uiStrings = await payload.findGlobal({ slug: 'ui-strings' }) as unknown as UiString
  const about = await payload.findGlobal({ slug: 'about' }) as unknown as About

  const contactUi = {
    title: uiStrings.contact?.title || 'Contact',
    subtitle: uiStrings.contact?.subtitle || 'Me contacter',
    nameLabel: uiStrings.contact?.nameLabel || 'Nom',
    namePlaceholder: uiStrings.contact?.namePlaceholder || 'Votre nom',
    emailLabel: uiStrings.contact?.emailLabel || 'Email',
    emailPlaceholder: uiStrings.contact?.emailPlaceholder || 'votre@email.com',
    messageLabel: uiStrings.contact?.messageLabel || 'Message',
    messagePlaceholder: uiStrings.contact?.messagePlaceholder || 'Votre message...',
    submitButton: uiStrings.contact?.submitButton || 'Envoyer',
    submitting: uiStrings.contact?.submitting || 'Envoi en cours...',
    successTitle: uiStrings.contact?.successTitle || 'Message envoyé !',
    successMessage: uiStrings.contact?.successMessage || 'Merci pour votre message.',
  }

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
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-accent text-sm uppercase tracking-widest mb-2 md:mb-4 font-semibold italic">
            {contactUi.subtitle}
          </h2>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 md:mb-12 text-primary">
            {contactUi.title}
          </h1>
          
          <ContactForm 
            uiStrings={contactUi}
            initialSubject={subject}
            initialMessage={message}
          />
        </div>
      </main>

      <Footer 
        copyright={uiStrings.common?.footerCopyright || '© Mama Couture'}
        adminAccess={uiStrings.common?.adminAccess || 'Administration'}
      />
    </div>
  )
}
