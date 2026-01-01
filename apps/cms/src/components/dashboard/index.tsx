import React from 'react'
import { Gutter } from '@payloadcms/ui'

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            <Gutter>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h1 style={{ marginBottom: '10px' }}>Bienvenue, Mama Couture 🧵</h1>
                        <p style={{ color: 'var(--theme-elevation-400)', maxWidth: '600px' }}>
                            Votre centre de commande pour gérer l'atelier, vos pièces uniques et rester en contact avec vos clients.
                        </p>
                    </div>

                    {/* Actions Rapides Bar */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <a href="http://localhost:3001" target="_blank" rel="noreferrer" style={quickButtonStyle}>
                            👁️ Voir le site
                        </a>
                        <a href="/admin/collections/creations/create" style={quickButtonStyle}>
                            ✨ Nouvelle créations
                        </a>
                        <a href="/admin/globals/about" style={quickButtonStyle}>
                            📖 Ma Bio
                        </a>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                    {/* Card Créations */}
                    <div style={cardStyle}>
                        <h2 style={cardTitleStyle}>👗 Boutique</h2>
                        <p style={cardDescStyle}>Gérez vos pièces uniques et organisez vos collections thématiques.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <a href="/admin/collections/creations" style={primaryButtonStyle}>Gérer les créations</a>
                            <a href="/admin/collections/series" style={secondaryButtonStyle}>Collections</a>
                        </div>
                    </div>

                    {/* Card Messages */}
                    <div style={cardStyle}>
                        <h2 style={cardTitleStyle}>💌 Derniers Messages</h2>
                        <p style={cardDescStyle}>Consultez vos demandes de personnalisation et réservations.</p>
                        <a href="/admin/collections/messages" style={primaryButtonStyle}>Voir la messagerie</a>
                    </div>

                    {/* Card Analytics */}
                    <div style={{
                        ...cardStyle,
                        borderLeft: '4px solid #2563eb'
                    }}>
                        <h2 style={cardTitleStyle}>📊 Visibilité</h2>
                        <p style={cardDescStyle}>Suivez vos visites et découvrez vos pièces les plus populaires en temps réel.</p>
                        <a href="https://cloud.umami.is/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                ...primaryButtonStyle,
                                backgroundColor: '#2563eb',
                                color: 'white'
                            }}>
                            Stats Umami
                        </a>
                    </div>

                    {/* Card Configuration */}
                    <div style={cardStyle}>
                        <h2 style={cardTitleStyle}>🛠️ Configuration</h2>
                        <p style={cardDescStyle}>Textes du site, interface et paramètres globaux de l'Atelier.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <a href="/admin/globals/ui-strings" style={primaryButtonStyle}>Textes</a>
                            <a href="/admin/globals/site-settings" style={secondaryButtonStyle}>Réglages</a>
                        </div>
                    </div>

                    {/* Boîte à outils */}
                    <div style={{ ...cardStyle, gridColumn: '1 / -1', marginTop: '20px', backgroundColor: 'transparent', border: '1px dashed var(--theme-elevation-200)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: 'var(--theme-elevation-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🧰 Boîte à outils</h3>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer" style={toolLinkStyle}>📸 Médiathèque Cloudinary</a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={toolLinkStyle}>📸 Instagram Atelier Petit Point</a>
                        </div>
                    </div>
                </div>
            </Gutter>
        </div>
    )
}

// Styles
const cardStyle: React.CSSProperties = {
    padding: '30px',
    backgroundColor: 'var(--theme-elevation-50)',
    borderRadius: '12px',
    border: '1px solid var(--theme-elevation-100)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
}

const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.3rem',
    marginBottom: '10px',
    fontWeight: '600'
}

const cardDescStyle: React.CSSProperties = {
    marginBottom: '20px',
    color: 'var(--theme-elevation-500)',
    fontSize: '0.95rem',
    lineHeight: '1.5'
}

const primaryButtonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'var(--theme-elevation-800)',
    color: 'var(--theme-elevation-50)',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'background-color 0.2s'
}

const secondaryButtonStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    backgroundColor: 'var(--theme-elevation-150)',
    color: 'var(--theme-elevation-800)',
}

const quickButtonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: 'var(--theme-elevation-100)',
    color: 'var(--theme-elevation-800)',
    textDecoration: 'none',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    border: '1px solid var(--theme-elevation-200)',
    transition: 'all 0.2s'
}

const toolLinkStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: 'var(--theme-elevation-600)',
    textDecoration: 'none',
    borderBottom: '1px solid var(--theme-elevation-200)',
    paddingBottom: '2px'
}

export default Dashboard
