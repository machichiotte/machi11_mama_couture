import React from 'react'
import { Gutter } from '@payloadcms/ui'

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            <Gutter>
                <h1 style={{ marginBottom: '10px' }}>Bienvenue, Mama Couture 🧵</h1>
                <p style={{ marginBottom: '40px', color: 'var(--theme-elevation-400)' }}>
                    Ceci est votre espace de gestion. Vous pouvez ici ajouter vos nouvelles créations, modifier les textes du site, et consulter vos messages.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                    {/* Card Créations */}
                    <div style={{
                        padding: '30px',
                        backgroundColor: 'var(--theme-elevation-50)',
                        borderRadius: '10px',
                        border: '1px solid var(--theme-elevation-100)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>👗 Créations</h2>
                        <p style={{ marginBottom: '20px' }}>Ajoutez ou modifiez vos pièces uniques et séries limitées.</p>
                        <a href="/admin/collections/creations"
                            style={{
                                display: 'inline-block',
                                padding: '10px 20px',
                                backgroundColor: 'var(--theme-elevation-800)',
                                color: 'var(--theme-elevation-50)',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}>
                            Gérer les créations
                        </a>
                    </div>

                    {/* Card Messages */}
                    <div style={{
                        padding: '30px',
                        backgroundColor: 'var(--theme-elevation-50)',
                        borderRadius: '10px',
                        border: '1px solid var(--theme-elevation-100)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>💌 Messages</h2>
                        <p style={{ marginBottom: '20px' }}>Consultez les demandes envoyées via le formulaire de contact.</p>
                        <a href="/admin/collections/messages"
                            style={{
                                display: 'inline-block',
                                padding: '10px 20px',
                                backgroundColor: 'var(--theme-elevation-800)',
                                color: 'var(--theme-elevation-50)',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}>
                            Voir les messages
                        </a>
                    </div>

                    {/* Card Site */}
                    <div style={{
                        padding: '30px',
                        backgroundColor: 'var(--theme-elevation-50)',
                        borderRadius: '10px',
                        border: '1px solid var(--theme-elevation-100)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>⚙️ Configuration</h2>
                        <p style={{ marginBottom: '20px' }}>Modifiez les textes, la bio, et les paramètres globaux du site.</p>
                        <a href="/admin/globals/site-settings"
                            style={{
                                display: 'inline-block',
                                padding: '10px 20px',
                                backgroundColor: 'var(--theme-elevation-0)',
                                border: '1px solid var(--theme-elevation-200)',
                                color: 'var(--theme-elevation-800)',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}>
                            Paramètres du site
                        </a>
                    </div>

                    {/* Card Analytics */}
                    <div style={{
                        padding: '30px',
                        backgroundColor: 'var(--theme-elevation-50)',
                        borderRadius: '10px',
                        border: '1px solid var(--theme-elevation-100)',
                        gridColumn: '1 / -1'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📊 Statistiques (Umami)</h2>
                        <p style={{ marginBottom: '20px' }}>Consultez les visites, les clics sur vos collections et les réservations en temps réel.</p>
                        <a href="https://cloud.umami.is/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                padding: '10px 20px',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}>
                            Accéder à mon tableau de bord Umami
                        </a>
                    </div>
                </div>
            </Gutter>
        </div>
    )
}

export default Dashboard
