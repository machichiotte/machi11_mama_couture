import type { CollectionConfig } from 'payload'

export const Creations: CollectionConfig = {
    slug: 'creations',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'series', 'stockStatus', 'isPublished', 'createdAt'],
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
                {
                    label: 'Stock & Disponibilité',
                    fields: [
                        {
                            name: 'price',
                            label: 'Prix (€)',
                            type: 'number',
                            admin: {
                                description: 'Laissez vide pour afficher "Sur devis"',
                                condition: (data) => data.stockStatus !== 'hidden',
                            },
                        },
                        {
                            name: 'stockStatus',
                            label: 'Statut de disponibilité',
                            type: 'select',
                            required: true,
                            defaultValue: 'hidden',
                            options: [
                                {
                                    label: '🎨 Portfolio uniquement (pas de badge)',
                                    value: 'hidden',
                                },
                                {
                                    label: '✅ En stock',
                                    value: 'in-stock',
                                },
                                {
                                    label: '❌ Vendu',
                                    value: 'sold',
                                },
                                {
                                    label: '📦 Sur commande',
                                    value: 'on-order',
                                },
                            ],
                            admin: {
                                description: 'Choisissez "Portfolio uniquement" pour ne pas afficher de badge de disponibilité (pièce non destinée à la vente).',
                            },
                        },
                        {
                            name: 'stockQuantity',
                            label: 'Quantité en stock',
                            type: 'number',
                            min: 0,
                            admin: {
                                description: 'Optionnel : indiquez le nombre d\'exemplaires disponibles',
                                condition: (data) => data.stockStatus === 'in-stock',
                            },
                        },
                        {
                            name: 'promoLabel',
                            label: 'Pastille promotionnelle',
                            type: 'text',
                            admin: {
                                description: 'Optionnel : texte à afficher sur la pastille promo (ex: "-20%", "NOUVEAU", "Édition limitée"). Laissez vide pour ne pas afficher de pastille.',
                                placeholder: 'Ex: -20%, NOUVEAU, Édition limitée',
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
                                description: 'Si vous avez une réduction en pourcentage (ex: 20 pour -20%), le prix réduit sera calculé et affiché automatiquement.',
                                placeholder: 'Ex: 20 pour -20%',
                                condition: (data) => data.stockStatus !== 'hidden' && !!data.price,
                            },
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
