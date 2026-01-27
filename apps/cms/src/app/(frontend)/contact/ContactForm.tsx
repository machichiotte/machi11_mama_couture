'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { submitContactForm } from './actions'

interface ContactFormProps {
  uiStrings: {
    title: string
    subtitle: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    submitButton: string
    submitting: string
    successTitle: string
    successMessage: string
  }
  initialSubject?: string
  initialMessage?: string
}

export const ContactForm: React.FC<ContactFormProps> = ({ 
  uiStrings, 
  initialSubject = '', 
  initialMessage = '' 
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(initialMessage)
  const [subject] = useState(initialSubject)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError('')
    
    const result = await submitContactForm({
      name,
      email,
      message,
      subject: subject || `Nouveau message de ${name}`
    })
    
    if (result.success) {
      setIsSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
    } else {
      setError(result.error || 'Erreur inconnue')
    }
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/50 p-12 rounded-sm border border-accent/20 text-center"
      >
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-serif text-primary mb-4">{uiStrings.successTitle}</h3>
        <p className="text-primary/60 font-light italic text-lg leading-relaxed">
          {uiStrings.successMessage}
        </p>
        <button 
          onClick={() => setIsSuccess(false)} 
          className="mt-10 text-accent font-bold uppercase tracking-widest text-xs border-b border-accent pb-1"
        >
          Envoyer un autre message
        </button>
      </motion.div>
    )
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6 md:space-y-10 text-left bg-secondary p-6 md:p-14 shadow-xl border border-primary/10 rounded-sm relative overflow-hidden transition-colors duration-500"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className="space-y-2 md:space-y-3">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 block">
            {uiStrings.nameLabel}
          </label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text" 
            required
            className="w-full bg-transparent border-b border-primary/10 py-3 md:py-4 focus:border-accent outline-none transition-all duration-500 text-primary placeholder:text-primary/20" 
            placeholder={uiStrings.namePlaceholder} 
          />
        </div>
        <div className="space-y-2 md:space-y-3">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 block">
            {uiStrings.emailLabel}
          </label>
          <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" 
            required
            className="w-full bg-transparent border-b border-primary/10 py-3 md:py-4 focus:border-accent outline-none transition-all duration-500 text-primary placeholder:text-primary/20" 
            placeholder={uiStrings.emailPlaceholder} 
          />
        </div>
      </div>

      {subject && (
        <div className="mt-4 space-y-2 md:space-y-3">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 block">
            Objet du message
          </label>
          <input 
            value={subject}
            readOnly
            className="w-full bg-transparent border-b border-primary/10 py-3 md:py-4 outline-none text-primary/60 italic font-serif cursor-default" 
          />
        </div>
      )}

      <div className="mt-4 space-y-2 md:space-y-3">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 block">
          {uiStrings.messageLabel}
        </label>
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5} 
          required
          className="w-full bg-transparent border-b border-primary/10 py-3 md:py-4 focus:border-accent outline-none transition-all duration-500 resize-none text-primary placeholder:text-primary/20 leading-relaxed" 
          placeholder={uiStrings.messagePlaceholder}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm italic py-2">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="premium-button w-full py-4 md:py-5 text-sm uppercase tracking-[0.3em] font-bold group relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
           {isSubmitting ? uiStrings.submitting : uiStrings.submitButton}
           {!isSubmitting && (
             <ArrowRight className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
           )}
        </span>
      </button>
      
      <p className="text-center text-[10px] text-primary/30 uppercase tracking-widest mt-6 md:mt-8">
        Votre vie privée est respectée. Aucune donnée n&apos;est partagée.
      </p>
    </form>
  )
}
