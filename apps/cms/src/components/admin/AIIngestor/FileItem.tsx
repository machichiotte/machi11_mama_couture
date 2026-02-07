'use client'

import React, { useState, useEffect } from 'react'
import { X, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@payloadcms/ui/elements/Button'
import { AIResult } from './types'

interface FileItemProps {
    file: File
    index: number
    result?: AIResult
    isAnalyzing: boolean
    onRemove: (index: number) => void
    onCreate: (index: number) => void
    onAnalyze: (index: number, userTitle?: string, userDescription?: string) => void
    mode: 'series' | 'creation'
    onUpdateResult: (index: number, newResult: AIResult) => void
    presetResult?: AIResult
}

export const FileItem: React.FC<FileItemProps> = ({
    file,
    index,
    result,
    isAnalyzing,
    onRemove,
    onCreate,
    onAnalyze,
    mode,
    onUpdateResult,
    presetResult
}) => {
    const [objectUrl, setObjectUrl] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<'object' | 'theme' | 'creative'>('theme')
    const [userTitle, setUserTitle] = useState('')
    const [userDescription, setUserDescription] = useState('')

    useEffect(() => {
        if (presetResult && !result) {
            onUpdateResult(index, presetResult)
        }
    }, [presetResult, result, index, onUpdateResult])

    useEffect(() => {
        const url = URL.createObjectURL(file)
        setObjectUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    const handleTypeChange = (type: 'object' | 'theme' | 'creative') => {
        setSelectedType(type)
        if (result?.titleOptions && result?.descriptionOptions) {
            onUpdateResult(index, {
                ...result,
                title: result.titleOptions[type],
                description: result.descriptionOptions[type]
            })
        }
    }

    const displayTitle = result?.title || ''
    const displayDescription = result?.description || ''

    return (
        <li className="relative group overflow-hidden bg-zinc-900/80 border border-white/10 rounded-[3rem] shadow-2xl transition-all duration-500 hover:border-rose-500/30">
            <div className="flex flex-col lg:grid lg:grid-cols-12 h-auto">

                {/* Image Column */}
                <div className="lg:col-span-5 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col items-center justify-center bg-black/20 p-12">
                    {objectUrl && (
                        <div className="relative group/img w-full max-w-[280px]">
                            <img
                                src={objectUrl}
                                alt={file.name}
                                className="w-full aspect-square object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Filename with more space */}
                            <div className="mt-8 text-center px-4">
                                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] block break-all leading-relaxed">
                                    {file.name}
                                </span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => onRemove(index)}
                        className="absolute top-8 left-8 p-3 bg-white text-black hover:bg-rose-500 hover:text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-30 shadow-xl border-none outline-none"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>

                {/* Analysis/Results Column */}
                <div className="lg:col-span-7 flex flex-col h-full">
                    <div className="p-12 flex-1 flex flex-col justify-center">
                        {isAnalyzing ? (
                            <div className="flex items-center gap-6 animate-in fade-in duration-500 py-12">
                                <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(244,63,94,0.3)]" />
                                <div className="space-y-1">
                                    <span className="text-xl font-black text-white tracking-tight block uppercase">Analyse...</span>
                                </div>
                            </div>
                        ) : !result ? (
                            <div className="space-y-8">
                                <p className="text-zinc-400 font-bold leading-relaxed italic opacity-80">
                                    {mode === 'series'
                                        ? "Guidez l'IA avec vos idées ou laissez-la créer votre collection."
                                        : "Prêt pour l'analyse IA."}
                                </p>

                                <button
                                    onClick={() => onAnalyze(index, userTitle || undefined, userDescription || undefined)}
                                    className="px-10 py-5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 w-fit group border-none"
                                >
                                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                                    Lancer l'Analyse
                                </button>
                            </div>
                        ) : result ? (
                            <div className="space-y-8 animate-in fade-in duration-700">
                                {result.error ? (
                                    <div className="p-8 bg-black/40 border border-red-500/30 rounded-3xl text-red-400 font-bold flex items-center gap-4">
                                        <div className="p-2 bg-red-500/20 rounded-full">!</div>
                                        {result.error}
                                    </div>
                                ) : (
                                    <>
                                        {/* Version Selector (if available) */}
                                        {result.titleOptions && (
                                            <div className="flex bg-black/50 p-1.5 rounded-xl border border-white/10 gap-1 w-fit">
                                                {(['object', 'theme', 'creative'] as const).map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => handleTypeChange(type)}
                                                        className={`py-2 px-4 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all ${selectedType === type
                                                            ? 'bg-rose-500 text-white shadow-lg'
                                                            : 'text-zinc-500 hover:text-white'
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="space-y-8">
                                            <div className="p-10 bg-black/30 border border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden group/result">
                                                <div className="space-y-6 relative z-10">
                                                    <div className="text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight uppercase">{displayTitle}</div>
                                                    <div className="h-px bg-white/5 w-full" />
                                                    <div className="text-zinc-400 font-bold leading-relaxed text-sm lg:text-base line-clamp-6">{displayDescription}</div>
                                                </div>
                                            </div>

                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => onCreate(index)}
                                                    className="px-12 py-5 bg-white text-black hover:bg-rose-500 hover:text-white font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-12 transition-all hover:scale-[1.02] active:scale-95 border-none outline-none"
                                                >
                                                    <span>Confirmer</span>
                                                    <CheckCircle2 size={32} />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </li>
    )
}
