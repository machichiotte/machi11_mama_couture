'use client'

import React, { useState, useEffect } from 'react'
import { X, Sparkles, CheckCircle2 } from 'lucide-react'
import { AIResult, IngestorFile } from './types'
import { AnalysisSelector, AnalysisCard } from './AnalysisResultUI'
import { SeriesSelector } from './SeriesSelector'

interface FileItemProps {
    id: string
    index: number
    files: File[]
    result?: AIResult
    userTitle?: string
    userDescription?: string
    userSeries?: string
    isAnalyzing: boolean
    onRemove: (id: string) => void
    onCreate: (id: string) => void
    onAnalyze: (id: string, userTitle?: string, userDescription?: string) => void
    mode: 'series' | 'creation'
    onUpdateResult: (id: string, newResult: AIResult) => void
    onUpdateFields: (id: string, fields: Partial<Pick<IngestorFile, 'userTitle' | 'userDescription' | 'userSeries'>>) => void
    series: { id: string | number, title: string }[]
}

export const FileItem: React.FC<FileItemProps> = ({
    id,
    index,
    files,
    result,
    userTitle,
    userDescription,
    userSeries,
    isAnalyzing,
    onRemove,
    onCreate,
    onAnalyze,
    mode,
    onUpdateResult,
    onUpdateFields,
    series
}) => {
    const [objectUrls, setObjectUrls] = useState<string[]>([])
    const [selectedType, setSelectedType] = useState<'object' | 'theme' | 'creative'>('object')

    useEffect(() => {
        const urls = files.map(f => URL.createObjectURL(f))
        setObjectUrls(urls)
        return () => urls.forEach(url => URL.revokeObjectURL(url))
    }, [files])

    const handleTypeChange = (type: 'object' | 'theme' | 'creative') => {
        setSelectedType(type)
        if (result?.titleOptions && result?.descriptionOptions) {
            onUpdateResult(id, {
                ...result,
                title: result.titleOptions[type],
                description: result.descriptionOptions[type]
            })
        }
    }

    return (
        <li className="relative group ai-card ai-card-hover shadow-2xl overflow-visible">
            {/* Numbering Badge */}
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-zinc-900 border border-brand-accent/30 flex items-center justify-center text-lg font-black text-brand-accent z-50 shadow-[0_0_20px_rgba(244,208,63,0.3)] animate-in zoom-in duration-500">
                #{index + 1}
            </div>

            <button
                onClick={() => onRemove(id)}
                className="absolute top-4 right-4 p-2.5 bg-zinc-900 text-zinc-500 hover:bg-red-500/20 hover:text-red-500 rounded-xl border border-white/5 transition-all opacity-0 group-hover:opacity-100 z-50 shadow-xl"
                title="Supprimer"
            >
                <X size={18} strokeWidth={3} />
            </button>
            <div className="flex flex-col lg:grid lg:grid-cols-12 min-h-[600px]">

                {/* Left Column: Image & Filename */}
                <div className="lg:col-span-4 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col items-center justify-center bg-white/5 p-12">
                    {objectUrls.length > 0 && (
                        <div className="relative group/img w-full max-w-[280px]">
                            {/* Pile of images effect if multiple */}
                            {objectUrls.length > 1 && (
                                <>
                                    <div className="absolute inset-0 rotate-3 translate-x-2 translate-y-2 bg-white/5 border border-white/10 rounded-2xl -z-10" />
                                    <div className="absolute inset-0 -rotate-3 -translate-x-2 translate-y-2 bg-white/5 border border-white/10 rounded-2xl -z-20" />
                                </>
                            )}

                            <img
                                src={objectUrls[0]}
                                alt={files[0].name}
                                className="w-full aspect-square object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-700"
                            />

                            {objectUrls.length > 1 && (
                                <div className="mt-4 flex gap-2 justify-center overflow-x-auto py-2 no-scrollbar">
                                    {objectUrls.slice(1, 4).map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            className="w-12 h-12 rounded-lg object-cover border border-white/10 opacity-60 hover:opacity-100 transition-opacity"
                                            alt={`Preview ${i + 2}`}
                                        />
                                    ))}
                                    {objectUrls.length > 4 && (
                                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                            <span className="text-[10px] font-bold">+{objectUrls.length - 4}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 text-center px-4">
                                <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider block break-all leading-relaxed opacity-80">
                                    {files.length > 1 ? `${files.length} Photos` : files[0].name}
                                </span>
                            </div>
                        </div>
                    )}


                </div>

                {/* Right Column: Analysis Content */}
                <div className="lg:col-span-8 flex flex-col h-full bg-white/5 overflow-hidden">
                    <div className="p-12 flex-1 flex flex-col min-h-0">
                        {isAnalyzing ? (
                            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500">
                                <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(244,208,63,0.3)] mb-6" />
                                <span className="text-xl font-bold text-white tracking-tight">Analyse en cours...</span>
                            </div>
                        ) : !result ? (
                            <div className="flex-1 flex flex-col justify-center space-y-8">
                                <p className="text-zinc-400 font-bold leading-relaxed italic opacity-80">
                                    {mode === 'series'
                                        ? "Guidez l'IA avec vos idées ou laissez-la créer votre collection."
                                        : "Prêt pour l'analyse IA."}
                                </p>
                                <button
                                    onClick={() => onAnalyze(id)}
                                    className="ai-button-primary px-10 py-5 group transition-all"
                                >
                                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                                    Lancer l&apos;Analyse
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 space-y-8 animate-in fade-in duration-700">
                                {result.error ? (
                                    <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden group/result flex flex-col h-[500px] shrink-0">
                                        <div className="p-2 bg-red-500/20 rounded-full">!</div>
                                        {result.error}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 flex flex-col justify-between min-h-0">
                                            <div className="space-y-8 overflow-y-auto pr-4 no-scrollbar pb-8">
                                                <div className="flex-1 space-y-10">
                                                    <div className="flex items-center justify-between">
                                                        <AnalysisSelector
                                                            selectedType={selectedType}
                                                            onTypeChange={handleTypeChange}
                                                            hasOptions={!!result.titleOptions}
                                                        />
                                                    </div>

                                                    <div className="space-y-6 px-4">
                                                        {/* Seamless Title */}
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                value={userTitle || result.title}
                                                                onChange={(e) => onUpdateFields(id, { userTitle: e.target.value })}
                                                                className="w-full bg-transparent border-none p-0 text-3xl font-black text-white focus:ring-0 outline-none placeholder:opacity-20 tracking-tight"
                                                                placeholder="Titre..."
                                                            />

                                                            {/* Integrated Collection Selector */}
                                                            {mode === 'creation' && (
                                                                <div className="max-w-md -ml-3">
                                                                    <SeriesSelector
                                                                        series={series}
                                                                        label="Collection"
                                                                        value={userSeries || result.seriesMatch}
                                                                        onChange={(val) => onUpdateFields(id, { userSeries: val })}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Seamless Description */}
                                                        <textarea
                                                            value={userDescription || result.description}
                                                            onChange={(e) => onUpdateFields(id, { userDescription: e.target.value })}
                                                            rows={15}
                                                            className="w-full bg-transparent border-none p-0 text-base text-zinc-400 focus:text-white transition-colors focus:ring-0 outline-none resize-none font-bold leading-relaxed no-scrollbar"
                                                            placeholder="Description..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-center shrink-0 pt-6 border-t border-white/5">
                                                <button
                                                    onClick={() => onCreate(id)}
                                                    className="ai-button-primary px-16 py-5 group hover:scale-105 transition-transform"
                                                >
                                                    <span className="text-sm font-black tracking-widest">CONFIRMER ET CRÉER</span>
                                                    <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </li>
    )
}
