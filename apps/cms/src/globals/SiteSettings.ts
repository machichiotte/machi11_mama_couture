import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
    slug: 'site-settings',
    admin: {
        group: 'Site Web',
    },
    access: {
        read: () => true,
        update: ({ req: { user } }) => !!user,
    },
    fields: [
        {
            name: 'siteTitle',
            type: 'text',
            required: true,
        },
        {
            name: 'tagline',
            type: 'text',
        },
        {
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
        },
    ],
}
