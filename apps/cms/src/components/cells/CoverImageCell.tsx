'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const CoverImageCell: React.FC<any> = (props) => {
    const { rowData, cellData, collectionSlug: propsSlug, collectionConfig, collection } = props
    const [url, setUrl] = useState<string | null>(null)

    // Détection du slug avec stratégie anti-mismatch
    const [slug, setSlug] = useState(propsSlug || collectionConfig?.slug || collection?.slug || 'series')

    useEffect(() => {
        if (!propsSlug && !collectionConfig?.slug && !collection?.slug) {
            const parts = window.location.pathname.split('/')
            const colIndex = parts.indexOf('collections')
            if (colIndex !== -1 && parts[colIndex + 1]) {
                setSlug(parts[colIndex + 1])
            }
        }
    }, [propsSlug, collectionConfig, collection])

    const imageDoc = cellData
    const editUrl = `/admin/collections/${slug}/${rowData.id}`

    useEffect(() => {
        const getImageUrl = async () => {
            if (typeof imageDoc === 'object' && imageDoc?.url) {
                setUrl(imageDoc.url)
                return
            }

            if (typeof imageDoc === 'string') {
                try {
                    const response = await fetch(`/api/media/${imageDoc}`)
                    const data = await response.json()
                    if (data?.url) {
                        setUrl(data.url)
                    }
                } catch (err) {
                    console.error("Failed to fetch thumbnail", err)
                }
            }
        }

        getImageUrl()
    }, [imageDoc])

    return (
        <Link href={editUrl} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', minHeight: '42px' }}>
            <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid var(--theme-elevation-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--theme-elevation-100)',
                cursor: 'pointer',
                transition: 'transform 0.1s ease',
            }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {url ? (
                    <img
                        src={url}
                        alt="Thumbnail"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ fontSize: '9px', color: 'var(--theme-elevation-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        {imageDoc ? '...' : 'N/A'}
                    </div>
                )}
            </div>
        </Link>
    )
}

export default CoverImageCell
