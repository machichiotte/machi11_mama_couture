import type { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
    slug: 'series',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'isPublished', 'order'],
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
            name: 'title',
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
            name: 'isPublished',
            type: 'checkbox',
            defaultValue: false,
            index: true,
        },
        {
            name: 'order',
            type: 'number',
            index: true,
        },
        {
            name: 'seo',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                },
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
    ],
}
