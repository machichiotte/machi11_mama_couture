import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
    slug: 'messages',
    admin: {
        useAsTitle: 'subject',
        defaultColumns: ['name', 'email', 'subject', 'createdAt', 'delete'],
        group: 'Communication',
    },
    labels: {
        singular: 'Message',
        plural: 'Messages',
    },
    access: {
        create: () => true, // On autorise la création publique pour le formulaire de contact
        read: ({ req: { user } }) => !!user, // Only admins can read
        delete: ({ req: { user } }) => !!user,
    },
    fields: [
        {
            name: 'name',
            label: 'Nom',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
        },
        {
            name: 'subject',
            label: 'Sujet',
            type: 'text',
        },
        {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            required: true,
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
    hooks: {
        beforeChange: [
            ({ data, req }) => {
                req.payload.logger.info(`📩 Nouveau message de contact entrant de: ${data?.email}`)
                return data
            }
        ],
        beforeDelete: [
            ({ id }) => {
                console.log(`🗑️ [Messages] Tentative de suppression du message: ${id}`)
            }
        ],
        afterChange: [
            async ({ doc, operation, req }) => {
                if (operation === 'create') {
                    const artisanEmail = process.env.SMTP_FROM_ADDRESS || 'atelier@petit-point.fr'

                    // On lance l'envoi en arrière-plan sans 'await' 
                    // pour ne pas faire attendre le client (surtout avec les timeouts SMTP sur Render)
                    req.payload.sendEmail({
                        to: artisanEmail,
                        subject: `Nouveau message de contact : ${doc.subject || 'Atelier Petit Point'}`,
                        html: `
                            <div style="font-family: serif; padding: 20px; border: 1px solid #eee;">
                                <h2 style="color: #6d4c41;">Nouveau message reçu</h2>
                                <p><strong>De :</strong> ${doc.name} (${doc.email})</p>
                                <p><strong>Sujet :</strong> ${doc.subject || 'Non spécifié'}</p>
                                <div style="background: #f9f9f9; padding: 15px; margin-top: 10px; border-left: 4px solid #6d4c41;">
                                    ${doc.message.replace(/\n/g, '<br>')}
                                </div>
                                <p style="font-size: 12px; color: #999; margin-top: 20px;">Ce message est également archivé dans votre panel d'administration.</p>
                            </div>
                        `
                    }).catch(error => {
                        console.error('❌ Email notification failed (background):', error)
                    })
                }
            }
        ]
    },
    timestamps: true,
}
