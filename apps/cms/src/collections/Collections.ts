import type { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
    slug: 'series',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['coverImage', 'title', 'isPublished', 'order', 'edit'],
        group: 'Boutique',
    },
    labels: {
        singular: 'Série',
        plural: 'Séries',
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
                            admin: {
                                components: {
                                    Cell: '../components/cells/TextCell#default',
                                },
                            },
                        },
                        {
                            name: 'description',
                            label: 'Description',
                            type: 'textarea',
                        },
                        {
                            name: 'coverImage',
                            label: 'Image de couverture',
                            type: 'upload',
                            relationTo: 'media',
                            required: true,
                            admin: {
                                components: {
                                    Cell: '../components/cells/CoverImageCell#default',
                                },
                            },
                        },
                        {
                            name: 'order',
                            label: 'Ordre d\'affichage',
                            type: 'number',
                            index: true,
                            admin: {
                                components: {
                                    Cell: '../components/cells/NumberCell#default',
                                },
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
            label: 'Publié sur le site',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                components: {
                    Cell: '../components/cells/ToggleCell#default',
                },
            },
            index: true,
        },
        {
            name: 'edit',
            type: 'ui',
            admin: {
                components: {
                    Cell: '../components/cells/EditCell#default',
                },
            },
        },
    ],
}
