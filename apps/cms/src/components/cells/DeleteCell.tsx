'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteCellProps {
    collectionSlug: string
    rowData: { id: string }
}

const DeleteCell: React.FC<DeleteCellProps> = (props) => {
    const { collectionSlug, rowData } = props
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    if (!rowData?.id) return null

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
            setLoading(true)
            try {
                const response = await fetch(`/api/${collectionSlug}/${rowData.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                })

                if (response.ok) {
                    router.refresh()
                } else {
                    alert("Erreur lors de la suppression")
                }
            } catch (error) {
                console.error("Delete error:", error)
                alert("Une erreur est survenue")
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px' }}>
            <button
                onClick={handleDelete}
                disabled={loading}
                title="Supprimer"
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#ef4444',
                    padding: '8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.5 : 1,
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
                {loading ? (
                    <span style={{ fontSize: '14px' }}>⌛</span>
                ) : (
                    <svg
                        width="18"
                        height="18"
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
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                )}
            </button>
        </div>
    )
}

export default DeleteCell
