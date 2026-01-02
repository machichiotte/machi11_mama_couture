'use client'
import React from 'react'
import { useAuth } from '@payloadcms/ui'

const HeaderAvatar: React.FC = () => {
    const { user } = useAuth()

    // On essaie de récupérer l'URL de l'avatar
    // Note: Dans le header, l'avatar peut être déjà populé ou être juste un ID
    const avatar = user?.avatar
    const avatarUrl = typeof avatar === 'object' ? avatar?.url : (user as any)?.avatarUrl

    return (
        <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'var(--theme-elevation-100)',
            backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1.5px solid var(--theme-elevation-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            {!avatarUrl && (
                <span style={{ fontSize: '16px', filter: 'grayscale(1)', opacity: 0.6 }}>
                    🧵
                </span>
            )}
        </div>
    )
}

export default HeaderAvatar
