import type { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
    slug: 'series',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'isPublished', 'order'],
        group: 'Boutique',
    },
    access: {
        read: ({ req: { user } }) => {
            if (user) return true
            return {
                isPublished: {
                    equals: true,
                },
            }
        },
    },
    versions: {
        drafts: true,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Général',
                    fields: [
                        {
                            name: 'title',
                            label: 'Titre',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                        },
                        {
                            name: 'coverImage',
                            type: 'upload',
                            relationTo: 'media',
                            required: true,
                        },
                        {
                            name: 'order',
                            type: 'number',
                            index: true,
                        },
                    ],
                },
            ],
        },
        {
            name: 'slug',
            label: 'Lien URL (Slug)',
            type: 'text',
            admin: {
                position: 'sidebar',
                description: 'Généré automatiquement à partir du titre',
            },
            hooks: {
                beforeValidate: [
                    ({ data }) => {
                        if (data?.title) {
                            return data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                        }
                        return data?.slug
                    },
                ],
            },
        },
        {
            name: 'isPublished',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
            },
            index: true,
        },
    ],
}
