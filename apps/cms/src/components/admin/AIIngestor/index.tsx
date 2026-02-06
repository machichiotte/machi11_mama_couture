'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@payloadcms/ui/elements/Button'
import { IngestorHeader } from './IngestorHeader'
import { IngestorActions } from './IngestorActions'
import { FileItem } from './FileItem'

type AIResult = {
    title: string
    description: string
    price?: number
    alt?: string
    seriesMatch?: string
    error?: string
}

type FileWithAnalysis = {
    file: File
    result?: AIResult
    isAnalyzing: boolean
}

type Mode = 'series' | 'creation'

export const AIIngestor: React.FC = () => {
    const [mode, setMode] = useState<Mode>('series')
    const [files, setFiles] = useState<FileWithAnalysis[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                isAnalyzing: false,
            }))
            setFiles(newFiles)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
            file,
            isAnalyzing: false,
        }))
        setFiles(droppedFiles)
    }

    const startAnalysis = async () => {
        setIsProcessing(true)

        const updatedFiles = [...files]

        for (let i = 0; i < updatedFiles.length; i++) {
            updatedFiles[i].isAnalyzing = true
            setFiles([...updatedFiles])

            try {
                const formData = new FormData()
                formData.append('file', updatedFiles[i].file)
                formData.append('mode', mode)

                const response = await fetch('/admin/api/ai', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) throw new Error("Analyse échouée")
                const data = await response.json()

                updatedFiles[i].result = data
                updatedFiles[i].isAnalyzing = false
            } catch (err) {
                console.error(err)
                updatedFiles[i].result = {
                    title: "Erreur",
                    description: "Impossible d'analyser cette image.",
                    error: String(err)
                }
                updatedFiles[i].isAnalyzing = false
            }

            setFiles([...updatedFiles])
        }

        setIsProcessing(false)
    }

    const createEntry = async (index: number) => {
        const fileData = files[index]
        if (!fileData.result || !fileData.file) return

        try {
            const formData = new FormData()
            formData.append('file', fileData.file)
            formData.append('title', fileData.result.title)
            formData.append('description', fileData.result.description)
            if (fileData.result.price) formData.append('price', String(fileData.result.price))
            if (fileData.result.alt) formData.append('alt', fileData.result.alt)
            if (fileData.result.seriesMatch) formData.append('seriesMatch', fileData.result.seriesMatch)

            const apiEndpoint = mode === 'series' ? '/admin/api/create-collection' : '/admin/api/create-creation'

            const res = await fetch(apiEndpoint, {
                method: 'POST',
                body: formData
            })

            if (res.ok) {
                alert('✓ Entrée créée avec succès !')
            } else {
                throw new Error('Erreur création')
            }
        } catch (e) {
            console.error(e)
            alert('Erreur lors de la création')
        }
    }

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const reset = () => {
        setFiles([])
        setIsProcessing(false)
    }

    const hasAnalysisPending = files.length > 0 && files.some(f => !f.result)
    const hasCreationPending = files.length > 0 && files.every(f => f.result && !f.result.error)

    return (
        <div data-testid="ai-ingestor-root">
            {/* Elegant Atelier Container */}
            <div
                data-testid="ai-ingestor"
                className="bg-gradient-to-br from-zinc-950 via-rose-950/10 to-amber-950/10 text-white rounded-3xl overflow-hidden shadow-2xl border border-rose-200/10 p-6 md:p-10 relative isolate"
            >
                <IngestorHeader />

                {/* Mode Selector */}
                <div className="flex justify-center gap-4 mb-10">
                    <button
                        onClick={() => { setMode('series'); reset() }}
                        className={`px-8 py-4 rounded-2xl font-bold shadow-lg transition-all ${mode === 'series'
                                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white scale-105 shadow-rose-500/50'
                                : 'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'
                            }`}
                    >
                        ✨ Nouvelle Collection
                    </button>
                    <button
                        onClick={() => { setMode('creation'); reset() }}
                        className={`px-8 py-4 rounded-2xl font-bold shadow-lg transition-all ${mode === 'creation'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white scale-105 shadow-amber-500/50'
                                : 'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'
                            }`}
                    >
                        🧵 Nouvelles Créations
                    </button>
                </div>

                {/* Drag & Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            group relative 
            bg-gradient-to-br from-zinc-900/40 to-rose-950/20 backdrop-blur-xl border 
            rounded-3xl p-16 text-center transition-all duration-500
            ${isDragging ? 'border-rose-400/50 shadow-[0_0_50px_-12px_rgba(244,63,94,0.5)] scale-[1.01]' : 'border-white/5 hover:border-white/10'}
          `}
                >
                    {/* Glowing Grid Background */}
                    <div
                        className={`
              absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500
              bg-[linear-gradient(to_right,#f4407620_1px,transparent_1px),linear-gradient(to_bottom,#f4407620_1px,transparent_1px)] bg-[size:40px_40px]
              [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]
              ${isDragging ? 'opacity-40 animate-pulse' : ''}
            `}
                    />

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple={mode === 'creation'}
                        accept="image/*"
                        className="hidden"
                    />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div
                            className={`
                w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500
                ${isDragging ? 'bg-rose-500/20 text-rose-400 scale-110' : 'bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white'}
              `}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-10 h-10"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>

                        <div className="space-y-2">
                            <p className="text-2xl font-serif font-light tracking-tight text-white/90">
                                Glissez-déposez vos photos
                            </p>
                            <p className="text-xs font-black text-rose-400/80 uppercase tracking-[0.3em]">
                                {mode === 'series' ? 'Créer une collection' : 'Ajouter des créations'}
                            </p>
                        </div>

                        <div className="pt-2">
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-zinc-950 hover:bg-rose-100 transition-colors font-bold rounded-full px-10 py-3 text-sm uppercase tracking-widest shadow-lg"
                            >
                                Importer des photos
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Files List */}
                {files.length > 0 && (
                    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <IngestorActions
                            filesCount={files.length}
                            isProcessing={isProcessing}
                            hasAnalysisPending={hasAnalysisPending}
                            hasCreationPending={hasCreationPending}
                            onReset={reset}
                            onStartAnalysis={startAnalysis}
                            onCreate={() => files.forEach((_, i) => createEntry(i))}
                            mode={mode}
                        />

                        <ul className="grid grid-cols-1 gap-12 mt-12">
                            {files.map((fileData, idx) => (
                                <FileItem
                                    key={`${fileData.file.name}-${idx}`}
                                    file={fileData.file}
                                    index={idx}
                                    result={fileData.result}
                                    isAnalyzing={fileData.isAnalyzing}
                                    onRemove={removeFile}
                                    onCreate={createEntry}
                                    mode={mode}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
