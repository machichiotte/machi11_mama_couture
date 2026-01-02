import type { CollectionConfig } from 'payload'

export const Creations: CollectionConfig = {
    slug: 'creations',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'series', 'stockStatus', 'isPublished', 'price', 'stockQuantity'],
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
                            admin: {
                                components: {
                                    Cell: './components/cells/RelationshipCell#default',
                                },
                            },
                        },
                    ],
                },
                {
                    label: 'Stock & Disponibilité',
                    fields: [
                        {
                            name: 'price',
                            label: 'Prix (€)',
                            type: 'number',
                            admin: {
                                components: {
                                    Cell: './components/cells/NumberCell#default',
                                },
                                condition: (data) => data.stockStatus !== 'hidden',
                            },
                        },
                        {
                            name: 'stockStatus',
                            label: 'Statut de disponibilité',
                            type: 'select',
                            required: true,
                            defaultValue: 'hidden',
                            admin: {
                                components: {
                                    Cell: './components/cells/StatusCell#default',
                                },
                            },
                            options: [
                                { label: '🎨 Portfolio uniquement', value: 'hidden' },
                                { label: '✅ En stock', value: 'in-stock' },
                                { label: '❌ Vendu', value: 'sold' },
                                { label: '📦 Sur commande', value: 'on-order' },
                            ],
                        },
                        {
                            name: 'stockQuantity',
                            label: 'Quantité en stock',
                            type: 'number',
                            min: 0,
                            admin: {
                                components: {
                                    Cell: './components/cells/NumberCell#default',
                                },
                                condition: (data) => data.stockStatus === 'in-stock',
                            },
                        },
                        {
                            name: 'promoLabel',
                            label: 'Pastille promotionnelle',
                            type: 'text',
                            admin: {
                                condition: (data) => data.stockStatus !== 'hidden',
                            },
                        },
                        {
                            name: 'promoPercentage',
                            label: 'Réduction (%)',
                            type: 'number',
                            min: 0,
                            max: 100,
                            admin: {
                                condition: (data) => data.stockStatus !== 'hidden' && !!data.price,
                            },
                        },
                    ],
                },
                {
                    label: 'Visibilité',
                    fields: [
                        {
                            name: 'isPublished',
                            label: 'Publié sur le site',
                            type: 'checkbox',
                            defaultValue: false,
                            index: true,
                            admin: {
                                components: {
                                    Cell: './components/cells/ToggleCell#default',
                                },
                            },
                        },
                        {
                            name: 'slug',
                            label: 'Lien URL (Slug)',
                            type: 'text',
                            admin: {
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
                    ],
                },
            ],
        },
    ],
    timestamps: true,
}
