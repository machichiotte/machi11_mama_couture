import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    group: 'Système',
    defaultColumns: ['avatar', 'name', 'email', 'edit'],
  },
  auth: true,
  labels: {
    singular: 'Utilisateur',
    plural: 'Utilisateurs',
  },
  fields: [
    {
      name: 'name',
      label: 'Nom complet',
      type: 'text',
      required: true,
      admin: {
        components: {
          Cell: '../components/cells/TextCell#default',
        },
      },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      admin: {
        components: {
          Cell: '../components/cells/TextCell#default',
        },
      },
    },
    {
      name: 'avatar',
      label: 'Photo de profil',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        components: {
          Cell: '../components/cells/AvatarCell#default',
        },
      }
    },
    {
      name: 'avatarUrl',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [
          async ({ data, req }) => {
            if (data?.avatar) {
              const mediaId = typeof data.avatar === 'object' ? data.avatar.id : data.avatar;
              try {
                const media = await req.payload.findByID({
                  collection: 'media',
                  id: mediaId,
                  depth: 0,
                });
                return media?.url || null;
              } catch (err) {
                console.error('Error fetching avatar URL:', err);
                return null;
              }
            }
            return null;
          }
        ]
      }
    },
    {
      name: 'edit',
      type: 'ui',
      admin: {
        components: {
          Cell: '../components/cells/EditCell#default',
        }
      }
    }
  ],
}
