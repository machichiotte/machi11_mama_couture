'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const TextCell: React.FC<any> = (props) => {
    const { cellData, rowData, field, collectionConfig } = props
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(cellData)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const collectionSlug = collectionConfig?.slug || 'creations'

    const handleSave = async () => {
        if (value === cellData) {
            setIsEditing(false)
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`/api/${collectionSlug}/${rowData.id}`, {
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
            router.refresh()
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
                color: value ? 'inherit' : 'var(--theme-elevation-400)',
                fontStyle: value ? 'normal' : 'italic',
                minHeight: '20px',
                display: 'flex',
                alignItems: 'center',
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.2s'
            }}
        >
            {value || 'cliquer pour éditer...'}
            {loading && <span style={{ marginLeft: '8px', fontSize: '10px' }}>⌛</span>}
        </div>
    )
}

export default TextCell
