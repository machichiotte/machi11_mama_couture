import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Collections } from './collections/Collections'
import { Creations } from './collections/Creations'
import { Messages } from './collections/Messages'
import { ArtisanProfile } from './globals/ArtisanProfile'
import { SiteSettings } from './globals/SiteSettings'
import { UIStrings } from './globals/UIStrings'

import { cloudinaryStorage } from 'payload-cloudinary'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Vérification stricte des variables d'environnement
const DATABASE_URL = process.env.DATABASE_URL
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

if (!DATABASE_URL) {
  console.error('❌ ERREUR CRITIQUE : DATABASE_URL est manquante dans les variables d\'environnement !')
}
if (!PAYLOAD_SECRET) {
  console.error('❌ ERREUR CRITIQUE : PAYLOAD_SECRET est manquante ! L\'admin ne pourra pas fonctionner.')
}
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('❌ ERREUR : Les variables Cloudinary sont incomplètes ! Le stockage des médias risque de ne pas fonctionner.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: [process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3001', 'http://localhost:3000'],
  csrf: [process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3001', 'http://localhost:3000'],
  collections: [Users, Media, Collections, Creations, Messages],
  globals: [ArtisanProfile, SiteSettings, UIStrings],
  editor: lexicalEditor(),
  secret: PAYLOAD_SECRET || 'temp-secret-if-missing-but-never-in-prod',
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/types/src/index.ts'),
  },
  db: mongooseAdapter({
    url: DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    cloudinaryStorage({
      config: {
        cloud_name: CLOUDINARY_CLOUD_NAME || '',
        api_key: CLOUDINARY_API_KEY || '',
        api_secret: CLOUDINARY_API_SECRET || '',
      },
      collections: {
        media: true,
      },
    }),
  ],
})
