'use client'
import React from 'react'

const ImageCell: React.FC<any> = (props) => {
    const { rowData } = props

    // On récupère la première image du tableau 'images'
    const firstItem = rowData?.images?.[0]
    const imageDoc = firstItem?.image

    if (!imageDoc) {
        return (
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '4px',
                backgroundColor: 'var(--theme-elevation-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'var(--theme-elevation-400)'
            }}>
                N/A
            </div>
        )
    }

    // Si c'est un objet (populé), on utilise l'URL, sinon on affiche un placeholder
    // Note: Payload 3 avec Cloudinary fournit souvent l'URL dans imageDoc.url
    const imageUrl = typeof imageDoc === 'object' ? imageDoc.url : null

    return (
        <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid var(--theme-elevation-200)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            backgroundColor: 'white'
        }}>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Thumbnail"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
            )}
        </div>
    )
}

export default ImageCell
