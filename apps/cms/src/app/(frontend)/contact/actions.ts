'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export async function submitContactForm(data: {
  name: string
  email: string
  message: string
  subject?: string
}) {
  try {
    const payload = await getPayload({ config })
    
    await payload.create({
      collection: 'messages',
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        subject: data.subject || `Nouveau message de ${data.name}`,
      },
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: 'Une erreur est survenue lors de l\'envoi du message.' }
  }
}
