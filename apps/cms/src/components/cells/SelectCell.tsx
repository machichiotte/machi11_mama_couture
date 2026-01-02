'use client'
import React, { useState } from 'react'

const SelectCell: React.FC<any> = (props) => {
    const { cellData, rowData, field } = props
    const [value, setValue] = useState(cellData)
    const [loading, setLoading] = useState(false)

    const options = field.options || []

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
            setValue(cellData)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ position: 'relative', minWidth: '80px' }}>
            <select
                value={value || ''}
                onChange={handleChange}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--theme-elevation-200)',
                    backgroundColor: 'var(--theme-elevation-100)',
                    color: 'var(--theme-elevation-800)',
                    fontSize: '11px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {!field.required && <option value="">-</option>}
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default SelectCell
