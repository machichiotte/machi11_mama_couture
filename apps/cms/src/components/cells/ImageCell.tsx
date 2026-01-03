'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ImageCellProps {
    rowData: {
        id: string
        images?: Array<{ image: string | { url: string } }>
    }
    collectionSlug?: string
    collectionConfig?: { slug: string }
    collection?: { slug: string }
}

const ImageCell: React.FC<ImageCellProps> = (props) => {
    const { rowData, collectionSlug: propsSlug, collectionConfig, collection } = props
    const [url, setUrl] = useState<string | null>(null)

    const images = rowData?.images || []
    const firstItem = images[0]
    const imageDoc = firstItem?.image
    const imageCount = images.length

    // Détection du slug avec stratégie anti-mismatch
    const [slug, setSlug] = useState(propsSlug || collectionConfig?.slug || collection?.slug || 'creations')

    useEffect(() => {
        if (!propsSlug && !collectionConfig?.slug && !collection?.slug) {
            const parts = window.location.pathname.split('/')
            const colIndex = parts.indexOf('collections')
            if (colIndex !== -1 && parts[colIndex + 1]) {
                setSlug(parts[colIndex + 1])
            }
        }
    }, [propsSlug, collectionConfig, collection])

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
                    console.error("Failed to fetch thumbnail for ImageCell:", err)
                }
            }
        }

        getImageUrl()
    }, [imageDoc])

    return (
        <Link href={editUrl} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', minHeight: '60px' }}>
            <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '6px',
                overflow: 'visible',
                border: '1px solid var(--theme-elevation-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--theme-elevation-100)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.1s ease',
            }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '5px',
                    overflow: 'hidden'
                }}>
                    {url ? (
                        <Image
                            src={url}
                            alt="Aperçu création"
                            width={42}
                            height={42}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{ fontSize: '9px', color: 'var(--theme-elevation-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            {imageDoc ? '...' : 'N/A'}
                        </div>
                    )}
                </div>

                {imageCount >= 2 && (
                    <div style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        border: '2px solid var(--theme-elevation-0)',
                        zIndex: 10
                    }}>
                        {imageCount}
                    </div>
                )}
            </div>
        </Link>
    )
}

export default ImageCell
