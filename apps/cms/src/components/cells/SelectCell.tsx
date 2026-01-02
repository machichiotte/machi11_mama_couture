'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SelectCell: React.FC<any> = (props) => {
    const { cellData, rowData, field, collectionSlug: propsSlug, collectionConfig, collection } = props
    const [value, setValue] = useState(cellData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const router = useRouter()

    const options = field.options || []

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
            console.error(err)
            setError(true)
            setTimeout(() => setError(false), 2000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ position: 'relative', minWidth: '100px' }}>
            <select
                value={value || ''}
                onChange={handleChange}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    borderTop: `2px solid ${error ? '#ef4444' : loading ? '#e5e7eb' : 'transparent'}`,
                    borderRight: `2px solid ${error ? '#ef4444' : loading ? '#e5e7eb' : 'transparent'}`,
                    borderBottom: `2px solid ${error ? '#ef4444' : loading ? '#e5e7eb' : 'transparent'}`,
                    borderLeft: `4px solid ${value && value !== '0' ? '#f59e0b' : '#94a3b8'}`,
                    backgroundColor: error ? '#fee2e2' : 'var(--theme-elevation-100)',
                    color: 'var(--theme-elevation-800)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%20%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center'
                }}
            >
                {!field.required && <option value="">-</option>}
                {options.map((opt: any) => (
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
                    width: '10px',
                    height: '10px',
                    border: '2px solid #f59e0b',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            )}

            <style jsx>{`
                @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
            `}</style>
        </div>
    )
}

export default SelectCell
