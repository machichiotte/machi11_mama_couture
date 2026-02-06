import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, Payload } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { v2 as cloudinary } from 'cloudinary'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { s3Storage } from '@payloadcms/storage-s3'

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Collections } from './collections/Collections'
import { Creations } from './collections/Creations'
import { Messages } from './collections/Messages'
import { seoPlugin } from '@payloadcms/plugin-seo'
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
  PAYLOAD_PUBLIC_SITE_URL,
  // R2 Configuration
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_ENDPOINT,
  R2_REGION,
  R2_PUBLIC_DOMAIN,
} = process.env

// Normalisation des URLs (retrait du slash final pour éviter les conflits CORS/CSRF)
const normalizeUrl = (url?: string) => url ? url.replace(/\/+$/, '') : ''

const finalServerURL = normalizeUrl(PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3011')
const finalSiteURL = normalizeUrl(PAYLOAD_PUBLIC_SITE_URL || '')

const finalDatabaseURL = DATABASE_URL || 'mongodb://localhost:27017/machi11_dev'
const finalPayloadSecret = PAYLOAD_SECRET || 'temp-secret-for-build-only'

// En production, on exige DATABASE_URL sauf pendant la phase de build de Next.js
if (!DATABASE_URL && process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
  throw new Error('FATAL: DATABASE_URL is missing in production runtime')
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME || '',
  api_key: CLOUDINARY_API_KEY || '',
  api_secret: CLOUDINARY_API_SECRET || '',
})


interface UploadFileNode {
  filename: string
  mimeType: string
  filesize: number
  buffer: Buffer
}

interface CloudinaryResult {
  public_id: string
  format: string
  bytes: number
  secure_url: string
}

const customCloudinaryAdapter = () => ({
  name: 'cloudinary-adapter',
  async handleUpload({ file }: { file: UploadFileNode }) {
    const cleanName = file.filename.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_')
    try {
      const uploadResult = await new Promise<CloudinaryResult>((resolve, reject) => {
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
            if (!result) return reject(new Error('Cloudinary upload failed'))
            resolve(result)
          },
        )
        uploadStream.end(file.buffer)
      })

      file.filename = `${uploadResult.public_id}.${uploadResult.format}`
      file.mimeType = uploadResult.format
      file.filesize = uploadResult.bytes
    } catch (err) {
      console.error('❌ Cloudinary Upload Error:', err)
      throw err
    }
  },

  async handleDelete({ filename }: { filename: string }) {
    if (!filename) return
    try {
      // Supprime en utilisant le chemin enregistré (machi11/...)
      await cloudinary.uploader.destroy(filename.replace(/\.[^/.]+$/, ''))
    } catch (error) {
      console.error('❌ Cloudinary Delete Error:', error)
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
        dashboard: {
          Component: './components/dashboard/index.tsx#default',
        },
      },
    },
  },
  onInit: async (payload: Payload) => {
    console.log('🚀 [CMS] Starting Payload...');
    console.log(`🚀 [CMS] SERVER_URL configured as: ${finalServerURL}`);
    console.log(`🚀 [CMS] SITE_URL configured as: ${finalSiteURL}`);
    console.log(`🚀 [CMS] DATABASE_URL present: ${!!DATABASE_URL}`);

    payload.logger.info('--- CMS CONFIG DEBUG ---')
    payload.logger.info(`SERVER_URL: ${finalServerURL}`)
    payload.logger.info(`SITE_URL: ${finalSiteURL}`)
    payload.logger.info(`ALLOWED ORIGINS: ${[finalSiteURL, finalServerURL].filter(Boolean).join(', ')}`)
    payload.logger.info(`DATABASE: ${DATABASE_URL ? 'Connected' : 'FALLBACK USED'}`)
    payload.logger.info(`SMTP: ${process.env.SMTP_HOST ? 'Configured (' + process.env.SMTP_HOST + ')' : 'MOCK USED'}`)
    payload.logger.info('------------------------')
  },
  i18n: {
    supportedLanguages: { fr },
    translations: {
      fr: {
        general: {
          createNew: 'Ajouter',
          create: 'Créer',
          add: 'Ajouter',
          edit: 'Modifier',
          save: 'Enregistrer',
          cancel: 'Annuler',
          delete: 'Supprimer',
          loading: 'Chargement...',
          noResults: 'Aucun résultat trouvé',
          confirm: 'Confirmer',
          confirmDelete: 'Supprimer définitivement',
        },
        fields: {
          name: 'Nom',
          email: 'Email',
          title: 'Titre',
          description: 'Description',
          image: 'Image',
          images: 'Images',
          createdAt: 'Créé le',
          updatedAt: 'Modifié le',
          slug: 'Lien URL',
          status: 'Statut',
        },
        version: {
          version: 'Version',
          versions: 'Versions',
          draft: 'Brouillon',
          published: 'Publié',
        },
        upload: {
          bulkUpload: 'Envoi groupé',
          dragAndDropHere: 'Glissez-déposez vos fichiers ici',
          orClickToBrowse: 'ou cliquez pour parcourir',
        },
        collections: {
          create: 'Ajouter',
          createNew: 'Ajouter',
          delete: 'Supprimer',
          deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
        }
      },
    },
    fallbackLanguage: 'fr',
  },
  serverURL: finalServerURL,
  cors: [finalSiteURL, finalServerURL, 'http://localhost:3011', 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean) as string[],
  csrf: [finalSiteURL, finalServerURL, 'http://localhost:3011', 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean) as string[],
  collections: [Users, Media, Collections, Creations, Messages],
  globals: [About, SiteSettings, UIStrings],
  editor: lexicalEditor(),
  secret: finalPayloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: finalDatabaseURL,
    connectOptions: {
      serverSelectionTimeoutMS: 5000, // Timeout court pour le build/développement
      connectTimeoutMS: 10000,
    }
  }),
  sharp,
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'atelier@petit-point.fr',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Atelier Petit Point',
    // On n'active le transport réel que si SMTP_HOST est présent
    transportOptions: process.env.SMTP_HOST
      ? {
        host: process.env.SMTP_HOST || '',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465, // True pour 465, false pour 587
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
        connectionTimeout: 5000, // Timeout plus court pour ne pas bloquer
        tls: {
          rejectUnauthorized: false // Aide parfois avec les serveurs SMTP capricieux
        }
      }
      : {
        // Bouchon (mock) pour le développement local
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      },
  }),
  plugins: [
    // Storage R2 (Cloudflare) - Prioritaire si configuré
    ...(R2_ACCESS_KEY_ID ? [
      s3Storage({
        collections: {
          media: {
            disableLocalStorage: true,
            generateFileURL: ({ filename, prefix }) => {
              const domain = R2_PUBLIC_DOMAIN
              const bucket = R2_BUCKET
              const endpoint = R2_ENDPOINT

              let url = ''
              if (domain) {
                url = `${domain}/${bucket}/${prefix}/${filename}`
              } else {
                url = `${endpoint}/${bucket}/${prefix}/${filename}`
              }
              return url.replace(/([^:]\/)\/+/g, '$1')
            },
            prefix: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
          },
        },
        bucket: R2_BUCKET || '',
        config: {
          endpoint: R2_ENDPOINT || '',
          region: R2_REGION || 'auto',
          credentials: {
            accessKeyId: R2_ACCESS_KEY_ID || '',
            secretAccessKey: R2_SECRET_ACCESS_KEY || '',
          },
          forcePathStyle: true,
        },
      })
    ] : [
      // Fallback Cloudinary (Ancienne config)
      cloudStoragePlugin({
        collections: {
          media: {
            adapter: customCloudinaryAdapter,
            disableLocalStorage: true,
            generateFileURL: ({ filename }) => {
              const fullPath = `${CLOUDINARY_FOLDER}/${filename}`
              return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${fullPath}`
            },
          },
        },
      }),
    ]),
    seoPlugin({
      collections: ['series', 'creations'],
      globals: ['site-settings', 'about'],
      uploadsCollection: 'media',
      tabbedUI: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateTitle: ({ doc }: { doc: any }) => {
        const title = doc?.title?.value || doc?.name?.value || doc?.title || doc?.name || 'Atelier'
        return `Atelier Petit Point - ${title}`
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateDescription: ({ doc }: { doc: any }) => {
        return doc?.description?.value || doc?.bio?.value || doc?.description || doc?.bio || ''
      },
    }),
  ],
})
