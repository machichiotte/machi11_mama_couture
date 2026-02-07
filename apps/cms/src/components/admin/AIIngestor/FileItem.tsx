'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@payloadcms/ui/elements/Button'

type AIResult = {
    title: string
    titleOptions?: {
        object: string
        theme: string
        creative: string
    }
    description: string
    descriptionOptions?: {
        object: string
        theme: string
        creative: string
    }
    details?: string
    price?: number
    alt?: string
    seriesMatch?: string
    error?: string
}

interface FileItemProps {
    file: File
    index: number
    result?: AIResult
    isAnalyzing: boolean
    onRemove: (index: number) => void
    onCreate: (index: number) => void
    mode: 'series' | 'creation'
    onUpdateResult: (index: number, newResult: AIResult) => void
}

export const FileItem: React.FC<FileItemProps> = ({
    file,
    index,
    result,
    isAnalyzing,
    onRemove,
    onCreate,
    mode,
    onUpdateResult
}) => {
    const [objectUrl, setObjectUrl] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<'object' | 'theme' | 'creative'>('theme')

    useEffect(() => {
        const url = URL.createObjectURL(file)
        setObjectUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    // Handler pour changer le titre ET la description sélectionnés
    const handleTitleSelect = (type: 'object' | 'theme' | 'creative') => {
        if (!result || !result.titleOptions || !result.descriptionOptions) return

        setSelectedType(type)

        onUpdateResult(index, {
            ...result,
            title: result.titleOptions[type],
            description: result.descriptionOptions[type]
        })
    }

    // Déterminer le titre et la description affichés
    const displayTitle = result?.title || ''
    const displayDescription = result?.description || ''

    return (
        <li className="relative group overflow-hidden bg-gradient-to-br from-rose-950/20 to-amber-950/20 border border-rose-200/10 rounded-3xl shadow-2xl transition-all duration-500 hover:border-rose-200/30 hover:shadow-rose-500/10">
            <div className="flex flex-col md:grid md:grid-cols-[400px_1fr] h-auto md:h-[600px]">
                {/* Image Column */}
                <div className="relative h-96 md:h-full overflow-hidden border-r border-rose-200/10">
                    {objectUrl && (
                        <img
                            src={objectUrl}
                            alt={file.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity"
                        />
                    )}

                    {/* Image Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 z-20">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-mono text-white/60 uppercase tracking-wider truncate">
                                {file.name}
                            </span>
                            <span className="text-xs text-white/40 font-bold">
                                {(file.size / 1024).toFixed(0)} KB
                            </span>
                        </div>
                    </div>
                </div>

                {/* Analysis Column */}
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="p-8 flex-1 bg-gradient-to-br from-zinc-900/40 to-zinc-950/60 overflow-y-auto">
                        <div className="text-xs uppercase tracking-widest text-rose-400 font-bold px-4 py-2 bg-rose-500/10 rounded-full border border-rose-500/20 w-fit mb-6 flex items-center gap-2">
                            ✨ ANALYSE IA
                        </div>

                        {isAnalyzing ? (
                            <div className="flex items-center gap-3 text-rose-400/80 animate-pulse font-mono text-sm">
                                <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                                Analyse en cours...
                            </div>
                        ) : result ? (
                            <div className="space-y-6">
                                {result.error ? (
                                    <p className="text-red-400 font-bold">{result.error}</p>
                                ) : (
                                    <>
                                        <div>
                                            {/* Choix de titre si disponible */}
                                            {result.titleOptions && result.descriptionOptions ? (
                                                <div className="mb-4 space-y-3">
                                                    <span className="text-xs text-white/40 uppercase tracking-wider font-bold block">Choisir un style :</span>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {[
                                                            { key: 'object' as const, label: 'Objet', hint: 'Collection de cet objet' },
                                                            { key: 'theme' as const, label: 'Thème', hint: 'Ambiance / Saison' },
                                                            { key: 'creative' as const, label: 'Créatif', hint: 'Poétique' },
                                                        ].map((opt) => (
                                                            <button
                                                                key={opt.key}
                                                                onClick={() => handleTitleSelect(opt.key)}
                                                                className={`px-4 py-3 rounded-xl border text-left transition-all ${selectedType === opt.key
                                                                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-lg'
                                                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <div className="flex-1">
                                                                        <span className="block text-[10px] uppercase opacity-50 mb-1">{opt.label} · {opt.hint}</span>
                                                                        <span className="font-serif font-bold text-sm">{result.titleOptions[opt.key]}</span>
                                                                    </div>
                                                                    {selectedType === opt.key && (
                                                                        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                                                                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null}

                                            {/* Titre sélectionné */}
                                            <h3 className="text-2xl font-serif font-bold text-white mb-2">
                                                {displayTitle}
                                            </h3>

                                            {result.seriesMatch && (
                                                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-500/30">
                                                    Collection : {result.seriesMatch}
                                                </span>
                                            )}
                                            {result.price && (
                                                <div className="text-3xl font-bold text-amber-400 mt-3">
                                                    {result.price} €
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-white/70 italic leading-relaxed text-base">
                                            {displayDescription}
                                        </p>

                                        {result.details && (
                                            <div className="text-sm text-white/60 bg-white/5 p-4 rounded-xl border border-white/10 mt-4 leading-relaxed font-serif">
                                                <strong className="text-amber-400 block mb-1 uppercase tracking-widest text-xs">Signature & Matières</strong>
                                                {result.details}
                                            </div>
                                        )}

                                        {result.alt && (
                                            <div className="text-xs text-white/40 bg-white/5 p-3 rounded-lg border border-white/10">
                                                <strong className="text-white/60">SEO Alt :</strong> {result.alt}
                                            </div>
                                        )}

                                        <div className="pt-6 flex gap-3">
                                            <Button
                                                onClick={() => onCreate(index)}
                                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold"
                                            >
                                                ✓ Valider et Créer
                                            </Button>
                                            <Button buttonStyle="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                                                Modifier
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Remove Button */}
                <button
                    onClick={() => onRemove(index)}
                    className="absolute top-6 right-6 z-50 p-2.5 bg-black/40 backdrop-blur-md text-white/40 hover:bg-red-500/90 hover:text-white rounded-full transition-all border border-white/10 shadow-2xl"
                >
                    <X size={18} />
                </button>
            </div>
        </li>
    )
}
