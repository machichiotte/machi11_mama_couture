import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
    slug: 'messages',
    admin: {
        useAsTitle: 'subject',
        defaultColumns: ['name', 'email', 'subject', 'createdAt'],
    },
    access: {
        create: () => true, // Anyone can send a message
        read: ({ req: { user } }) => !!user, // Only admins can read
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'subject',
            type: 'text',
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
    ],
    timestamps: true,
}
