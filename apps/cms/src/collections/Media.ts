import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Médiathèque',
    useAsTitle: 'alt',
    defaultColumns: ['thumbnail', 'filename', 'alt', 'updatedAt', 'edit', 'delete'],
  },
  labels: {
    singular: 'Média',
    plural: 'Médias',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texte alternatif (Alt)',
      type: 'text',
      required: false,
      admin: {
        components: {
          Cell: './components/cells/TextCell#default',
        }
      }
    },
    {
      name: 'edit',
      type: 'ui',
      admin: {
        components: {
          Cell: './components/cells/EditCell#default',
        }
      }
    },
    {
      name: 'delete',
      type: 'ui',
      admin: {
        components: {
          Cell: './components/cells/DeleteCell#default',
        }
      }
    }
  ],
  upload: {
    staticDir: 'media',
  },
}
