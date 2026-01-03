'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface NumberCellProps {
    cellData: number
    rowData: { id: string }
    field: { name: string }
    collectionSlug?: string
    collectionConfig?: { slug: string }
    collection?: { slug: string }
}

const NumberCell: React.FC<NumberCellProps> = (props) => {
    const { cellData, rowData, field, collectionSlug: propsSlug, collectionConfig, collection } = props
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState<number | string>(cellData)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const fieldName = field.name

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
                    [fieldName]: Number(value),
                }),
            })

            if (!response.ok) throw new Error('Update failed')
            setIsEditing(false)
            router.refresh()
        } catch (err) {
            console.error(err)
            setValue(cellData) // Reset on error
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave()
        if (e.key === 'Escape') {
            setValue(cellData)
            setIsEditing(false)
        }
    }

    if (isEditing) {
        return (
            <input
                type="number"
                value={value || ''}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{
                    width: '80px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--theme-elevation-400)',
                    backgroundColor: 'var(--theme-elevation-0)',
                    color: 'var(--theme-elevation-800)',
                    fontSize: '12px'
                }}
            />
        )
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            style={{
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: loading ? 'transparent' : 'var(--theme-elevation-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                minWidth: '40px',
                minHeight: '60px',
                textAlign: 'right',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1,
                border: '1px dashed transparent'
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.border = '1px dashed var(--theme-elevation-400)'}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.border = '1px dashed transparent'}
        >
            <span>
                {value || 0} {fieldName === 'price' ? '€' : ''}
                {loading && <span style={{ marginLeft: '4px', fontSize: '10px' }}>⌛</span>}
            </span>
        </div>
    )
}

export default NumberCell
