import type { CollectionConfig } from 'payload'

export const AIIngestion: CollectionConfig = {
    slug: 'ai-ingestion',
    labels: {
        singular: 'Atelier IA',
        plural: 'Atelier IA',
    },
    admin: {
        useAsTitle: 'id',
        group: '🤖 Intelligence Artificielle',
        hidden: ({ user }) => !user,
        components: {
            views: {
                edit: {
                    Default: {
                        Component: './components/admin/AIIngestor/index.tsx#AIIngestor',
                    },
                },
            },
        },
    },
    access: {
        create: ({ req: { user } }) => !!user,
        read: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    fields: [
        {
            name: 'placeholder',
            type: 'text',
            admin: {
                hidden: true,
            },
        },
    ],
}
