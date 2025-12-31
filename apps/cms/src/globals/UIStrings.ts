import type { GlobalConfig } from 'payload'

export const UIStrings: GlobalConfig = {
    slug: 'ui-strings',
    admin: {
        group: 'Site Web',
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
                    name: 'about',
                    type: 'text',
                    defaultValue: 'À Propos',
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
                    name: 'description',
                    type: 'textarea',
                    defaultValue: "Chaque collection est une exploration de formes, de matières et d'histoires, façonnées avec patience et passion.",
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
                    name: 'exploreLabel',
                    type: 'text',
                    defaultValue: 'Explorer la Collection',
                },
                {
                    name: 'noCollections',
                    type: 'text',
                    defaultValue: 'Nos collections arrivent très prochainement.',
                },
                {
                    name: 'notifyMe',
                    type: 'text',
                    defaultValue: 'Être informé du lancement',
                },
                {
                    name: 'portfolioLabel',
                    type: 'text',
                    defaultValue: 'Portfolio',
                },
                {
                    name: 'piecesTitle',
                    type: 'text',
                    defaultValue: "Les Pièces d'Exception",
                },
                {
                    name: 'detailsButton',
                    type: 'text',
                    defaultValue: 'Détails',
                },
                {
                    name: 'emptyCollection',
                    type: 'text',
                    defaultValue: 'Cette collection ne contient pas encore de créations.',
                },
                {
                    name: 'inquiryLink',
                    type: 'text',
                    defaultValue: 'Se renseigner sur les prochaines pièces',
                },
                {
                    name: 'backToAll',
                    type: 'text',
                    defaultValue: 'Retour à toutes les collections',
                },
                {
                    name: 'loadingCollection',
                    type: 'text',
                    defaultValue: 'Immersion dans la collection...',
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
                },
                {
                    name: 'footerCopyright',
                    type: 'text',
                    defaultValue: '© 2025 Mama Couture. Confection Artisanale & Passion.',
                },
                {
                    name: 'adminAccess',
                    type: 'text',
                    defaultValue: 'Accès Artisan',
                }
            ]
        },
        {
            name: 'contact',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    defaultValue: 'Nous Contacter',
                },
                {
                    name: 'subtitle',
                    type: 'text',
                    defaultValue: 'Une question ?',
                },
                {
                    name: 'successTitle',
                    type: 'text',
                    defaultValue: 'Message Envoyé !',
                },
                {
                    name: 'successMessage',
                    type: 'textarea',
                    defaultValue: 'Merci pour votre message. Nous reviendrons vers vous très prochainement.',
                },
                {
                    name: 'submitButton',
                    type: 'text',
                    defaultValue: 'Envoyer le message',
                },
                {
                    name: 'submitting',
                    type: 'text',
                    defaultValue: 'Envoi en cours...',
                },
                {
                    name: 'nameLabel',
                    type: 'text',
                    defaultValue: 'Votre Nom',
                },
                {
                    name: 'namePlaceholder',
                    type: 'text',
                    defaultValue: 'Ex: Marie Laurent',
                },
                {
                    name: 'emailLabel',
                    type: 'text',
                    defaultValue: 'Votre Email',
                },
                {
                    name: 'emailPlaceholder',
                    type: 'text',
                    defaultValue: 'marie@email.com',
                },
                {
                    name: 'messageLabel',
                    type: 'text',
                    defaultValue: 'Votre Message',
                },
                {
                    name: 'messagePlaceholder',
                    type: 'text',
                    defaultValue: 'Écrivez-nous votre message ici...',
                }
            ]
        },
        {
            name: 'about',
            type: 'group',
            fields: [
                {
                    name: 'badge',
                    type: 'text',
                    defaultValue: "L'Âme de l'Atelier",
                },
                {
                    name: 'defaultTitle',
                    type: 'text',
                    defaultValue: 'Notre Histoire',
                },
                {
                    name: 'imageAlt',
                    type: 'text',
                    defaultValue: "Photo de l'artisan",
                }
            ]
        }
    ],
}
