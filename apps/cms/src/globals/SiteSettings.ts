import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
    slug: 'site-settings',
    admin: {
        group: 'Site Web',
    },
    label: 'Configuration',
    access: {
        read: () => true,
        update: ({ req: { user } }) => !!user,
    },
    fields: [
        {
            name: 'siteTitle',
            label: 'Titre du site',
            type: 'text',
            required: true,
        },
        {
            name: 'tagline',
            label: "Phrase d'accroche",
            type: 'text',
        },
        {
            name: 'heroImage',
            label: "Image d'accueil",
            type: 'upload',
            relationTo: 'media',
        },
    ],
}
