'use client'
import React, { useState, useEffect } from 'react'

const RelationshipCell: React.FC<any> = (props) => {
    const { cellData, rowData, field } = props
    const [options, setOptions] = useState<{ label: string, value: string }[]>([])
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(cellData?.id || cellData)

    const relationTo = field.relationTo

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch(`/api/${relationTo}?limit=100`)
                const data = await response.json()
                if (data.docs) {
                    setOptions(data.docs.map((doc: any) => ({
                        label: doc.title || doc.name || doc.id,
                        value: doc.id
                    })))
                }
            } catch (err) {
                console.error('Failed to fetch relation options', err)
            }
        }
        fetchOptions()
    }, [relationTo])

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value
        setLoading(true)

        try {
            const response = await fetch(`/api/creations/${rowData.id}`, {
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
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minWidth: '120px' }}>
            <select
                value={value || ''}
                onChange={handleChange}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    border: '1px solid var(--theme-elevation-200)',
                    backgroundColor: 'var(--theme-elevation-100)',
                    color: 'var(--theme-elevation-800)',
                    fontSize: '11px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    outline: 'none'
                }}
            >
                <option value="">Sélectionner...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default RelationshipCell
