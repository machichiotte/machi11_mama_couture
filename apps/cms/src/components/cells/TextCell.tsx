'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TextCellProps {
    cellData: string
    rowData: { id: string }
    field: { name: string }
    collectionSlug?: string
    collectionConfig?: { slug: string }
    collection?: { slug: string }
}

const TextCell: React.FC<TextCellProps> = (props) => {
    const { cellData, rowData, field, collectionSlug: propsSlug, collectionConfig, collection } = props
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(cellData)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Détection du slug avec stratégie anti-mismatch
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
                    fontSize: '13px',
                    fontWeight: '600'
                }}
            />
        )
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            style={{
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                color: value ? 'inherit' : 'var(--theme-elevation-400)',
                fontStyle: value ? 'normal' : 'italic',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.2s',
                maxWidth: '250px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}
        >
            {value || 'cliquer pour éditer...'}
            {loading && <span style={{ marginLeft: '8px', fontSize: '10px' }}>⌛</span>}
        </div>
    )
}

export default TextCell
