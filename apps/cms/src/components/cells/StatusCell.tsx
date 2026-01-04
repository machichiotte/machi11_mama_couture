'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface StatusCellProps {
    cellData: string
    rowData: { id: string }
    field: { name: string, options?: Array<{ label: string, value: string }> }
    collectionSlug?: string
    collectionConfig?: { slug: string }
    collection?: { slug: string }
}

const StatusCell: React.FC<StatusCellProps> = (props) => {
    const { cellData, rowData, field, collectionSlug: propsSlug, collectionConfig, collection } = props
    const [value, setValue] = useState(cellData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const router = useRouter()

    if (!rowData?.id) return null

    const options = field?.options || []
    if (!field?.name) return null

    // Détection robuste du slug de la collection avec stratégie anti-mismatch
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

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value
        setLoading(true)
        setError(false)

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

            setValue(newValue)
            router.refresh()
        } catch (err) {
            console.error(`Failed to update status for ${collectionSlug}:`, err)
            setError(true)
            setTimeout(() => setError(false), 2000)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (val: string) => {
        switch (val) {
            case 'in-stock': return '#10b981'
            case 'sold': return '#ef4444'
            case 'on-order': return '#3b82f6'
            default: return '#6b7280'
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', minHeight: '60px' }}>
            <div style={{ position: 'relative', minWidth: '150px' }}>
                <select
                    value={value}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        borderTop: `2px solid ${error ? '#ef4444' : loading ? '#e5e7eb' : 'transparent'}`,
                        borderRight: `2px solid ${error ? '#ef4444' : loading ? '#e5e7eb' : 'transparent'}`,
                        borderBottom: `2px solid ${error ? '#ef4444' : loading ? '#e5e7eb' : 'transparent'}`,
                        borderLeft: `4px solid ${getStatusColor(value)}`,
                        backgroundColor: error ? '#fee2e2' : 'var(--theme-elevation-100)',
                        color: 'var(--theme-elevation-800)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        outline: 'none',
                        transition: 'all 0.2s',
                    }}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {loading && (
                    <div style={{
                        position: 'absolute',
                        right: '25px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '12px',
                        height: '12px',
                        border: '2px solid #e11d48',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                )}

                <style jsx>{`
                    @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
                `}</style>
            </div>
        </div>
    )
}

export default StatusCell
