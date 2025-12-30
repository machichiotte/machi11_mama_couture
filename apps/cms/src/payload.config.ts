import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { v2 as cloudinary } from 'cloudinary'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Collections } from './collections/Collections'
import { Creations } from './collections/Creations'
import { Messages } from './collections/Messages'
import { About } from './globals/About'
import { SiteSettings } from './globals/SiteSettings'
import { UIStrings } from './globals/UIStrings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER = 'machi11', // Dossier par défaut
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
    const cleanName = file.filename.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_')

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: cleanName, // Juste le nom, sans le dossier
          asset_folder: CLOUDINARY_FOLDER, // Dossier dans la Media Library UI
          use_asset_folder_as_public_id_prefix: true, // Le dossier sera aussi dans l'URL
          tags: ['machi11_cms'],
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

import { fr } from 'payload/i18n/fr'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        Dashboard: {
          Component: '/components/Dashboard/index.tsx#default',
        },
      },
    },
  },
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
  },
  serverURL: PAYLOAD_PUBLIC_SERVER_URL,
  cors: [PAYLOAD_PUBLIC_SITE_URL, PAYLOAD_PUBLIC_SERVER_URL, 'http://localhost:3000'].filter(Boolean) as string[],
  csrf: [PAYLOAD_PUBLIC_SITE_URL, PAYLOAD_PUBLIC_SERVER_URL, 'http://localhost:3000'].filter(Boolean) as string[],
  collections: [Users, Media, Collections, Creations, Messages],
  globals: [About, SiteSettings, UIStrings],
  editor: lexicalEditor(),
  secret: PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/types/src/index.ts'),
  },
  db: mongooseAdapter({
    url: DATABASE_URL,
  }),
  sharp,
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'atelier@mamacouture.fr',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Mama Couture',
    // On n'active le transport réel que si SMTP_HOST est présent
    transportOptions: process.env.SMTP_HOST
      ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }
      : {
        // Bouchon (mock) pour le développement local
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      },
  }),
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: customCloudinaryAdapter,
          disableLocalStorage: true,
          generateFileURL: ({ filename }) => {
            // Payload enregistre juste le nom du fichier sans le dossier
            // On doit donc le reconstruire : dossier + filename
            const fullPath = `${CLOUDINARY_FOLDER}/${filename}`
            return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${fullPath}`
          },
        },
      },
    }),
  ],
})
