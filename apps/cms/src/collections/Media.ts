import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Médiathèque',
    useAsTitle: 'alt',
    defaultColumns: ['thumbnail', 'filename', 'alt', 'updatedAt', 'edit'],
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
    }
  ],
  upload: true,
}
