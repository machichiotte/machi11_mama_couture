import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { v2 as cloudinary } from 'cloudinary'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Collections } from './collections/Collections'
import { Creations } from './collections/Creations'
import { Messages } from './collections/Messages'
import { ArtisanProfile } from './globals/ArtisanProfile'
import { SiteSettings } from './globals/SiteSettings'
import { UIStrings } from './globals/UIStrings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  DATABASE_URL,
  PAYLOAD_SECRET,
  PAYLOAD_PUBLIC_SERVER_URL,
  PAYLOAD_PUBLIC_SITE_URL
} = process.env

if (!DATABASE_URL) throw new Error('FATAL: DATABASE_URL is missing')
if (!PAYLOAD_SECRET) throw new Error('FATAL: PAYLOAD_SECRET is missing')

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

const customCloudinaryAdapter: any = () => ({
  name: 'cloudinary-adapter',
  async handleUpload({ file }: any) {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          // On force le dossier DIRECTEMENT dans le public_id pour que Payload l'enregistre en base
          public_id: `machi11/${file.filename.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_')}`,
          tags: ['machi11_cms'], // Tag stable pour le suivi
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        },
      )
      uploadStream.end(file.buffer)
    })

    const result = uploadResult as any
    // On garde l'extension pour que Payload reconnaisse le type d'image pour les thumbnails
    file.filename = `${result.public_id}.${result.format}`
    file.mimeType = result.format
    file.filesize = result.bytes
  },

  async handleDelete({ filename }: any) {
    try {
      // Supprime en utilisant le chemin enregistré (machi11/...)
      await cloudinary.uploader.destroy(filename.replace(/\.[^/.]+$/, ''))
    } catch (error) {
      console.error('Cloudinary Delete Error:', error)
    }
  },

  staticHandler() {
    return new Response('Not implemented', { status: 501 })
  },
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  serverURL: PAYLOAD_PUBLIC_SERVER_URL,
  cors: [PAYLOAD_PUBLIC_SITE_URL, PAYLOAD_PUBLIC_SERVER_URL, 'http://localhost:3000'].filter(Boolean) as string[],
  csrf: [PAYLOAD_PUBLIC_SITE_URL, PAYLOAD_PUBLIC_SERVER_URL, 'http://localhost:3000'].filter(Boolean) as string[],
  collections: [Users, Media, Collections, Creations, Messages],
  globals: [ArtisanProfile, SiteSettings, UIStrings],
  editor: lexicalEditor(),
  secret: PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/types/src/index.ts'),
  },
  db: mongooseAdapter({
    url: DATABASE_URL,
  }),
  sharp,
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: customCloudinaryAdapter,
          disableLocalStorage: true,
          generateFileURL: ({ filename }) => {
            // On utilise le helper officiel qui gère parfaitement les dossiers et les versions
            return cloudinary.url(filename, {
              secure: true,
              resource_type: 'image', // On force image pour avoir /image/upload/ au lieu de /auto/
              version: Math.floor(Date.now() / 1000), // Force le rafraîchissement
            })
          },
        },
      },
    }),
  ],
})
