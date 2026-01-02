import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
    slug: 'about',
    admin: {
        group: 'Site Web',
    },
    label: 'À propos',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            label: 'Nom',
            type: 'text',
            required: true,
        },
        {
            name: 'bio',
            label: 'Biographie',
            type: 'richText',
            required: true,
        },
        {
            name: 'profileImage',
            label: 'Image de profil',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'contactEmail',
            label: 'Email de contact',
            type: 'email',
            required: true,
        },
        {
            name: 'socialLinks',
            label: 'Réseaux sociaux',
            type: 'array',
            labels: {
                singular: 'Lien',
                plural: 'Liens',
            },
            fields: [
                {
                    name: 'platform',
                    label: 'Plateforme',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'url',
                    label: 'Lien URL',
                    type: 'text',
                    required: true,
                },
            ],
        },
    ],
}
