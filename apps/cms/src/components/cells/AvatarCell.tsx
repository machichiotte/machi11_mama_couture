'use client'
import React, { useState, useEffect } from 'react'

interface AvatarCellProps {
    cellData?: string | { url?: string }
}

const AvatarCell: React.FC<AvatarCellProps> = (props) => {
    const { cellData } = props
    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        if (cellData) {
            // Si cellData est déjà un objet (populé)
            if (typeof cellData === 'object' && cellData.url) {
                setUrl(cellData.url)
            }
            // Si c'est un ID, on va chercher l'info
            else if (typeof cellData === 'string') {
                fetch(`/api/media/${cellData}`, { credentials: 'include' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.url) setUrl(data.url)
                    })
                    .catch(err => console.error("Error fetching avatar:", err))
            }
        }
    }, [cellData])

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60px',
            width: '40px'
        }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--theme-elevation-200)',
                backgroundImage: url ? `url(${url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid var(--theme-elevation-300)'
            }}>
                {!url && <span style={{ fontSize: '12px', opacity: 0.5 }}>👤</span>}
            </div>
        </div>
    )
}

export default AvatarCell
