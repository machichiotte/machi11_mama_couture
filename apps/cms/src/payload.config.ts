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
import { ArtisanProfile } from './globals/ArtisanProfile'
import { SiteSettings } from './globals/SiteSettings'
import { UIStrings } from './globals/UIStrings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { cloudinaryAdapter } from '@payloadcms/plugin-cloud-storage/cloudinary'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: [process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3001', 'http://localhost:3000'],
  csrf: [process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3001', 'http://localhost:3000'],
  collections: [Users, Media, Collections, Creations],
  globals: [ArtisanProfile, SiteSettings, UIStrings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/types/src/index.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    ...(process.env.CLOUDINARY_URL
      ? [
        cloudStorage({
          collections: {
            media: {
              adapter: cloudinaryAdapter({
                config: {
                  cloudinary_url: process.env.CLOUDINARY_URL,
                },
              }),
            },
          },
        }),
      ]
      : []),
  ],
})
