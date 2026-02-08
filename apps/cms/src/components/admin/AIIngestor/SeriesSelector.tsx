import React from 'react'
import { Folder } from 'lucide-react'

interface SeriesSelectorProps {
    series: { id: string | number, title: string }[]
    value?: string
    onChange: (value: string) => void
    label?: string
    className?: string
}

export const SeriesSelector: React.FC<SeriesSelectorProps> = ({
    series,
    value,
    onChange,
    label = "Collection",
    className = ""
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="ai-label ml-1">{label}</label>}
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-brand-accent transition-colors pointer-events-none">
                    <Folder size={18} />
                </div>
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="ai-input pl-12 appearance-none cursor-pointer"
                >
                    <option value="" className="bg-zinc-900">Sélectionner une collection...</option>
                    {series.map((s) => (
                        <option key={s.id} value={s.title} className="bg-zinc-900">
                            {s.title}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
