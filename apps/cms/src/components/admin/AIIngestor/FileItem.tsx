'use client'

import React, { useState, useEffect } from 'react'
import { X, Sparkles, CheckCircle2 } from 'lucide-react'
import { AIResult } from './types'
import { AnalysisSelector, AnalysisCard } from './AnalysisResultUI'

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
}) => {
    const [objectUrl, setObjectUrl] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<'object' | 'theme' | 'creative'>('object')

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

    return (
        <li className="relative group ai-card ai-card-hover shadow-2xl">
            <button
                onClick={() => onRemove(index)}
                className="absolute top-6 right-6 p-2 bg-white text-black hover:bg-brand-accent hover:text-black rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-50 shadow-xl border-none outline-none"
            >
                <X size={16} strokeWidth={3} />
            </button>
            <div className="flex flex-col lg:grid lg:grid-cols-12 h-[500px] lg:h-[500px]">

                {/* Left Column: Image & Filename */}
                <div className="lg:col-span-4 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col items-center justify-center bg-white/5 p-12">
                    {objectUrl && (
                        <div className="relative group/img w-full max-w-[280px]">
                            <img
                                src={objectUrl}
                                alt={file.name}
                                className="w-full aspect-square object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="mt-8 text-center px-4">
                                <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider block break-all leading-relaxed opacity-80">
                                    {file.name}
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
                                    onClick={() => onAnalyze(index)}
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
                                            <div className="space-y-6">
                                                <div className="shrink-0">
                                                    <AnalysisSelector
                                                        selectedType={selectedType}
                                                        onTypeChange={handleTypeChange}
                                                        hasOptions={!!result.titleOptions}
                                                    />
                                                </div>
                                                <AnalysisCard
                                                    title={result.title}
                                                    description={result.description}
                                                />
                                            </div>

                                            <div className="flex justify-center shrink-0 pt-4">
                                                <button
                                                    onClick={() => onCreate(index)}
                                                    className="ai-button-primary px-12 py-5 group"
                                                >
                                                    <span className="text-s">CONFIRMER</span>
                                                    <CheckCircle2 size={16} />
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
