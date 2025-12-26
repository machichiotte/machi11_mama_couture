import type { CollectionConfig } from 'payload'

export const Creations: CollectionConfig = {
    slug: 'creations',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'series', 'isPublished', 'createdAt'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'richText',
        },
        {
            name: 'images',
            type: 'array',
            required: true,
            minRows: 1,
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
            ],
        },
        {
            name: 'series',
            type: 'relationship',
            relationTo: 'series' as const,
            required: true,
            index: true,
        },
        {
            name: 'price',
            type: 'number',
        },
        {
            name: 'isPublished',
            type: 'checkbox',
            defaultValue: false,
            index: true,
        },
    ],
    timestamps: true,
}
