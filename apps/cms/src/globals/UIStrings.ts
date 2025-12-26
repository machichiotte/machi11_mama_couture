import type { GlobalConfig } from 'payload'

export const UIStrings: GlobalConfig = {
    slug: 'ui-strings',
    admin: {
        group: 'Settings',
    },
    access: {
        read: () => true,
        update: ({ req: { user } }) => !!user,
    },
    fields: [
        {
            name: 'nav',
            type: 'group',
            fields: [
                {
                    name: 'collections',
                    type: 'text',
                    defaultValue: 'Collections',
                },
                {
                    name: 'artisan',
                    type: 'text',
                    defaultValue: 'L\'Artisan',
                },
                {
                    name: 'contact',
                    type: 'text',
                    defaultValue: 'Contact',
                },
                {
                    name: 'menuLabel',
                    type: 'text',
                    defaultValue: 'Menu',
                }
            ]
        },
        {
            name: 'hero',
            type: 'group',
            fields: [
                {
                    name: 'exploreButton',
                    type: 'text',
                    defaultValue: 'Explorer les Collections',
                    required: true,
                },
            ],
        },
        {
            name: 'collections',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    defaultValue: 'Nos Collections',
                },
                {
                    name: 'viewAll',
                    type: 'text',
                    defaultValue: 'Voir tout',
                },
                {
                    name: 'discoverButton',
                    type: 'text',
                    defaultValue: 'Découvrir',
                },
                {
                    name: 'noImage',
                    type: 'text',
                    defaultValue: "Pas d'image",
                },
                {
                    name: 'uniqueCreationsLabel',
                    type: 'text',
                    defaultValue: 'créations uniques',
                },
            ],
        },
        {
            name: 'common',
            type: 'group',
            fields: [
                {
                    name: 'loading',
                    type: 'text',
                    defaultValue: 'Chargement...',
                },
                {
                    name: 'contactTitle',
                    type: 'text',
                    defaultValue: 'Contact & Réseaux',
                }
            ]
        }
    ],
}
