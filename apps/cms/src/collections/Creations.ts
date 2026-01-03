import type { CollectionConfig } from 'payload'

export const Creations: CollectionConfig = {
    slug: 'creations',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['images', 'title', 'series', 'stockStatus', 'price', 'promoLabel', 'promoPercentage', 'isPublished', 'edit', 'delete'],
        group: 'Boutique',
    },
    labels: {
        singular: 'Création',
        plural: 'Créations',
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
        delete: ({ req: { user } }) => !!user,
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
                            admin: {
                                components: {
                                    Cell: './components/cells/TextCell#default',
                                },
                            },
                        },
                        {
                            name: 'description',
                            label: 'Description',
                            type: 'richText',
                        },
                        {
                            name: 'images',
                            label: 'Images',
                            type: 'array',
                            required: true,
                            minRows: 1,
                            admin: {
                                components: {
                                    Cell: './components/cells/ImageCell#default',
                                },
                            },
                            fields: [
                                {
                                    name: 'image',
                                    label: 'Image',
                                    type: 'upload',
                                    relationTo: 'media',
                                    required: true,
                                },
                            ],
                        },
                        {
                            name: 'series',
                            label: 'Collection / Série',
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
                            label: 'Pastille promo',
                            type: 'text',
                            admin: {
                                components: {
                                    Cell: './components/cells/TextCell#default',
                                },
                                placeholder: 'Ex: -20%, NOUVEAU, Édition limitée',
                                condition: (data) => data.stockStatus !== 'hidden',
                            },
                        },
                        {
                            name: 'promoPercentage',
                            label: 'Réduction (%)',
                            type: 'select',
                            defaultValue: '0',
                            admin: {
                                components: {
                                    Cell: './components/cells/SelectCell#default',
                                },
                                condition: (data) => data.stockStatus !== 'hidden' && !!data.price,
                            },
                            options: [
                                { label: 'Pas de réduction', value: '0' },
                                { label: '-10%', value: '10' },
                                { label: '-15%', value: '15' },
                                { label: '-20%', value: '20' },
                                { label: '-25%', value: '25' },
                                { label: '-30%', value: '30' },
                                { label: '-40%', value: '40' },
                                { label: '-50%', value: '50' },
                            ],
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
        {
            name: 'edit',
            type: 'ui',
            admin: {
                components: {
                    Cell: './components/cells/EditCell#default',
                },
            },
        },
        {
            name: 'delete',
            type: 'ui',
            admin: {
                components: {
                    Cell: './components/cells/DeleteCell#default',
                },
            },
        },
    ],
    timestamps: true,
}
