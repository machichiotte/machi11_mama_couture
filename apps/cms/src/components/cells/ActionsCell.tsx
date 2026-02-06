'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ActionsCellProps {
    rowData: { id: string }
    collectionSlug?: string
    collectionConfig?: { slug: string }
    collection?: { slug: string }
}

const ActionsCell: React.FC<ActionsCellProps> = (props) => {
    const { rowData, collectionSlug: propsSlug, collectionConfig, collection } = props
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Robust slug detection
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

    if (!rowData?.id) return null

    const editUrl = `/admin/collections/${slug}/${rowData.id}`

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
            setLoading(true)
            try {
                const publicServerUrl = process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL || '';
                const isOnCloudflare = typeof window !== 'undefined' && window.location.hostname.includes('pages.dev');

                const apiBase = (isOnCloudflare && publicServerUrl)
                    ? `${publicServerUrl.replace(/\/$/, '')}/api`
                    : '/api';

                const targetUrl = `${apiBase}/${slug}/${rowData.id}`;

                const response = await fetch(targetUrl, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                    }
                })

                if (response.ok) {
                    router.refresh()
                } else {
                    const text = await response.text()
                    alert(`Erreur ${response.status}: ${text}`)
                }
            } catch (error) {
                console.error("Delete error:", error)
                alert("Erreur réseau lors de la suppression")
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '40px'
        }}>
            {/* Edit Button */}
            <Link
                href={editUrl}
                title="Modifier"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--theme-elevation-100)',
                    color: 'var(--theme-elevation-600)',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    border: '1px solid var(--theme-elevation-200)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-elevation-800)'
                    e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                    e.currentTarget.style.color = 'var(--theme-elevation-600)'
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                </svg>
            </Link>

            {/* Delete Button */}
            <button
                onClick={handleDelete}
                disabled={loading}
                title="Supprimer"
                style={{
                    background: 'transparent',
                    border: '1px solid transparent',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#ef4444',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                    e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.2)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.border = '1px solid transparent'
                }}
            >
                {loading ? (
                    <span style={{ fontSize: '12px' }}>⌛</span>
                ) : (
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                )}
            </button>
        </div>
    )
}

export default ActionsCell
