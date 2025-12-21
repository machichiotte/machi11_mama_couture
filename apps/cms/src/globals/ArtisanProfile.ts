import type { GlobalConfig } from 'payload'

export const ArtisanProfile: GlobalConfig = {
    slug: 'artisan-profile',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'bio',
            type: 'richText',
            required: true,
        },
        {
            name: 'profileImage',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'contactEmail',
            type: 'email',
            required: true,
        },
        {
            name: 'socialLinks',
            type: 'array',
            fields: [
                {
                    name: 'platform',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'url',
                    type: 'text',
                    required: true,
                },
            ],
        },
    ],
}
