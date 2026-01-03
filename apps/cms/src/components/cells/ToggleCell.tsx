'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ToggleCellProps {
    cellData: boolean
    rowData: { id: string }
    field: { name: string }
    collectionSlug?: string
    collectionConfig?: { slug: string }
    collection?: { slug: string }
}

const ToggleCell: React.FC<ToggleCellProps> = (props) => {
    const { cellData, rowData, field, collectionSlug: propsSlug, collectionConfig, collection } = props
    const [checked, setChecked] = useState(cellData)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Détection robuste avec stratégie anti-mismatch
    const [collectionSlug, setCollectionSlug] = useState(propsSlug || collectionConfig?.slug || collection?.slug || 'creations')

    useEffect(() => {
        if (!propsSlug && !collectionConfig?.slug && !collection?.slug) {
            const parts = window.location.pathname.split('/')
            const colIndex = parts.indexOf('collections')
            if (colIndex !== -1 && parts[colIndex + 1]) {
                setCollectionSlug(parts[colIndex + 1])
            }
        }
    }, [propsSlug, collectionConfig, collection])

    const handleToggle = async () => {
        const newValue = !checked
        setLoading(true)

        try {
            const response = await fetch(`/api/${collectionSlug}/${rowData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [field.name]: newValue,
                }),
            })

            if (!response.ok) throw new Error('Update failed')

            setChecked(newValue)
            router.refresh()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '60px' }}>
            <div
                onClick={!loading ? handleToggle : undefined}
                style={{
                    width: '36px',
                    height: '20px',
                    borderRadius: '10px',
                    backgroundColor: checked ? '#10b981' : '#d1d5db',
                    position: 'relative',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s',
                    opacity: loading ? 0.6 : 1,
                    border: '1px solid rgba(0,0,0,0.05)'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: checked ? '18px' : '2px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'left 0.3s'
                }} />
            </div>
            <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: checked ? '#059669' : '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {checked ? 'Public' : 'Brouillon'}
            </span>
        </div>
    )
}

export default ToggleCell
