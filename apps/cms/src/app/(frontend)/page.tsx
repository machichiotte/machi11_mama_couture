import { redirect } from 'next/navigation'
import config from '@/payload.config'

export default async function HomePage() {
  const payloadConfig = await config

  // Redirection automatique vers le panel d'administration
  redirect(payloadConfig.routes.admin)
}
