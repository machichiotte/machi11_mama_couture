import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
    slug: 'site-settings',
    access: {
        read: () => true,
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
            name: 'seoDescription',
            type: 'textarea',
        },
        {
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
        },
    ],
}
