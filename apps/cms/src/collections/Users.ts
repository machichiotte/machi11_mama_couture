import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    group: 'Système',
    defaultColumns: ['avatar', 'name', 'email', 'edit'],
    // Force l'utilisation du champ 'avatar' pour l'icône de profil en haut à droite
    avatar: 'avatar' as any,
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: 'Nom complet',
      type: 'text',
      required: true,
    },
    {
      name: 'avatar',
      label: 'Photo de profil',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Image utilisée pour votre profil et en haut à droite de l\'interface.',
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
}
