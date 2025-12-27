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

// Validation stricte au démarrage
if (!process.env.DATABASE_URL) throw new Error('FATAL: DATABASE_URL is not defined')
if (!process.env.PAYLOAD_SECRET) throw new Error('FATAL: PAYLOAD_SECRET is not defined')
if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('FATAL: CLOUDINARY_CLOUD_NAME is not defined')
if (!process.env.CLOUDINARY_API_KEY) throw new Error('FATAL: CLOUDINARY_API_KEY is not defined')
if (!process.env.CLOUDINARY_API_SECRET) throw new Error('FATAL: CLOUDINARY_API_SECRET is not defined')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Optionnel mais recommandé pour éviter les 500 sur l'admin
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  cors: [process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3001', 'http://localhost:3000'].filter(Boolean) as string[],
  csrf: [process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3001', 'http://localhost:3000'].filter(Boolean) as string[],
  collections: [Users, Media, Collections, Creations, Messages],
  globals: [ArtisanProfile, SiteSettings, UIStrings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/types/src/index.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL!,
  }),
  sharp,
  plugins: [
    cloudinaryStorage({
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      },
      collections: {
        media: true,
      },
    }),
  ],
})
