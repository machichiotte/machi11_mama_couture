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
  PAYLOAD_PUBLIC_SITE_URL
} = process.env

const finalDatabaseURL = DATABASE_URL || 'mongodb://127.0.0.1:27017/machi11_mama_couture_fallback'
const finalServerURL = PAYLOAD_PUBLIC_SERVER_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000'
const finalPayloadSecret = PAYLOAD_SECRET || 'temp-secret-for-build-only'

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

      const result = uploadResult
      file.filename = `${result.public_id}.${result.format}`
      file.mimeType = result.format
      file.filesize = result.bytes
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
  onInit: async (payload) => {
    payload.logger.info('--- CMS CONFIG DEBUG ---')
    payload.logger.info(`SERVER_URL: ${finalServerURL}`)
    payload.logger.info(`SITE_URL: ${PAYLOAD_PUBLIC_SITE_URL || 'Not set'}`)
    payload.logger.info(`DATABASE: ${DATABASE_URL ? 'Connected' : 'FALLBACK USED'}`)
    payload.logger.info(`SMTP: ${process.env.SMTP_HOST ? 'Configured' : 'MOCK USED'}`)
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
  cors: [PAYLOAD_PUBLIC_SITE_URL, finalServerURL, 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean) as string[],
  csrf: [PAYLOAD_PUBLIC_SITE_URL, finalServerURL, 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean) as string[],
  collections: [Users, Media, Collections, Creations, Messages],
  globals: [About, SiteSettings, UIStrings],
  editor: lexicalEditor(),
  secret: finalPayloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: finalDatabaseURL,
  }),
  sharp,
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'atelier@mamacouture.fr',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Mama Couture',
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
        connectionTimeout: 10000, // On évite les attentes infinies
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
    seoPlugin({
      collections: ['series', 'creations'],
      globals: ['site-settings', 'about'],
      uploadsCollection: 'media',
      tabbedUI: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateTitle: ({ doc }: { doc: any }) => {
        const title = doc?.title?.value || doc?.name?.value || doc?.title || doc?.name || 'Atelier'
        return `Mama Couture - ${title}`
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateDescription: ({ doc }: { doc: any }) => {
        return doc?.description?.value || doc?.bio?.value || doc?.description || doc?.bio || ''
      },
    }),
  ],
})
