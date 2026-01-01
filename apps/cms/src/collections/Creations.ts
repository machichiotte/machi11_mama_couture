import type { CollectionConfig } from 'payload'

export const Creations: CollectionConfig = {
    slug: 'creations',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'series', 'isPublished', 'createdAt'],
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
                            relationTo: 'series' as any,
                            required: true,
                            index: true,
                        },
                        {
                            name: 'price',
                            type: 'number',
                        },
                    ],
                },
                {
                    label: 'Signature',
                    fields: [
                        {
                            name: 'features',
                            label: 'Détails Signature (points clés)',
                            type: 'array',
                            admin: {
                                description: 'Ajoutez les points spécifiques à cette création (ex: Matières, usage, etc.)',
                            },
                            fields: [
                                {
                                    name: 'label',
                                    type: 'text',
                                    required: true,
                                },
                            ],
                            defaultValue: [
                                { label: 'Fait-main avec soin dans mon atelier' },
                                { label: 'Pièce unique ou petite série' },
                                { label: 'Matériaux de haute qualité' },
                            ],
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
    timestamps: true,
}
