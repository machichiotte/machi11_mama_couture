'use client'
import React, { useState } from 'react'

const TextCell: React.FC<any> = (props) => {
    const { cellData, rowData, field } = props
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(cellData)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        if (value === cellData) {
            setIsEditing(false)
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`/api/creations/${rowData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [field.name]: value,
                }),
            })

            if (!response.ok) throw new Error('Update failed')
            setIsEditing(false)
        } catch (err) {
            console.error(err)
            setValue(cellData)
        } finally {
            setLoading(false)
        }
    }

    if (isEditing) {
        return (
            <input
                type="text"
                value={value || ''}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
                style={{
                    width: '100%',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    border: '1px solid var(--theme-elevation-400)',
                    backgroundColor: 'var(--theme-elevation-0)',
                    color: 'var(--theme-elevation-800)',
                    fontSize: '11px'
                }}
            />
        )
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            style={{
                cursor: 'pointer',
                fontSize: '11px',
                color: cellData ? 'inherit' : 'var(--theme-elevation-400)',
                fontStyle: cellData ? 'normal' : 'italic',
                minHeight: '20px',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {cellData || 'cliquer pour éditer...'}
        </div>
    )
}

export default TextCell
