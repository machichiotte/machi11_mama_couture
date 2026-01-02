'use client'
import React from 'react'
import Link from 'next/link'

const EditCell: React.FC<any> = (props) => {
    const { rowData } = props
    const editUrl = `/admin/collections/creations/${rowData.id}`

    return (
        <Link
            href={editUrl}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '6px',
                backgroundColor: 'var(--theme-elevation-100)',
                color: 'var(--theme-elevation-600)',
                transition: 'all 0.2s',
                textDecoration: 'none',
                border: '1px solid var(--theme-elevation-200)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--theme-elevation-800)'
                e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                e.currentTarget.style.color = 'var(--theme-elevation-600)'
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
            </svg>
        </Link>
    )
}

export default EditCell
