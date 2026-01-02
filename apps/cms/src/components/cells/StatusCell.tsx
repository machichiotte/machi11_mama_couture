'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConfig } from '@payloadcms/ui'

const StatusCell: React.FC<any> = (props) => {
    const { cellData, rowData, field } = props
    const [value, setValue] = useState(cellData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const router = useRouter()

    const config = useConfig()

    const options = field.options || []

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value
        setLoading(true)
        setError(false)

        try {
            const response = await fetch(`/api/creations/${rowData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stockStatus: newValue,
                }),
            })

            if (!response.ok) throw new Error('Update failed')

            setValue(newValue)
            router.refresh()
        } catch (err) {
            console.error(err)
            setError(true)
            // Revenir à l'ancienne valeur après 2s d'erreur
            setTimeout(() => setError(false), 2000)
        } finally {
            setLoading(false)
        }
    }

    // Couleurs basées sur le statut
    const getStatusColor = (val: string) => {
        switch (val) {
            case 'in-stock': return '#10b981'
            case 'sold': return '#ef4444'
            case 'on-order': return '#3b82f6'
            default: return '#6b7280'
        }
    }

    return (
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
                    width: '12px',
                    height: '12px',
                    border: '2px solid #e11d48',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            )}

            <style jsx>{`
        @keyframes spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
        </div>
    )
}

export default StatusCell
