'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, Loader2, Plus, Sparkles, Image, Type } from 'lucide-react'
import { FileItem } from './FileItem'
import { IngestorHeader } from './IngestorHeader'
import { IngestorActions } from './IngestorActions'
import { TextCollectionCreator } from './TextCollectionCreator'

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

type FileData = {
    file: File
    status: 'pending' | 'analyzing' | 'complete' | 'error'
    result?: AIResult
}

export const AIIngestor: React.FC = () => {
    const [mode, setMode] = useState<'series' | 'creation'>('creation')
    const [inputMode, setInputMode] = useState<'image' | 'text'>('image')
    const [files, setFiles] = useState<FileData[]>([])
    const [isGeneratingFromText, setIsGeneratingFromText] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            status: 'pending' as const
        }))
        setFiles(prev => [...prev, ...newFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        multiple: true
    })

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const analyzeFile = async (index: number) => {
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'analyzing' } : f))

        const fileData = files[index]
        const formData = new FormData()
        formData.append('file', fileData.file)
        formData.append('mode', mode)

        try {
            const res = await fetch('/admin/api/ai', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()

            // Si on a des options de titres, on prend 'theme' par défaut pour une collection, sinon le titre simple
            let defaultTitle = data.title
            if (data.titleOptions) {
                defaultTitle = mode === 'series' ? data.titleOptions.theme : data.titleOptions.object
            }

            setFiles(prev => prev.map((f, i) => i === index ? {
                ...f,
                status: 'complete',
                result: {
                    ...data,
                    title: defaultTitle // Set default selected title
                }
            } : f))
        } catch (e) {
            setFiles(prev => prev.map((f, i) => i === index ? {
                ...f,
                status: 'error',
                result: { title: '', description: '', error: 'Erreur analyse IA' }
            } : f))
        }
    }

    // Analyser tous les fichiers en attente
    const analyzeAll = () => {
        files.forEach((file, index) => {
            if (file.status === 'pending') {
                analyzeFile(index)
            }
        })
    }

    const createEntry = async (index: number) => {
        const fileData = files[index]
        if (!fileData.result || !fileData.file) return

        try {
            const formData = new FormData()
            formData.append('file', fileData.file)
            formData.append('title', fileData.result.title)
            formData.append('description', fileData.result.description)
            if (fileData.result.details) formData.append('details', fileData.result.details)
            if (fileData.result.price) formData.append('price', String(fileData.result.price))
            if (fileData.result.alt) formData.append('alt', fileData.result.alt)
            if (fileData.result.seriesMatch) formData.append('seriesMatch', fileData.result.seriesMatch)

            const apiEndpoint = mode === 'series' ? '/admin/api/create-collection' : '/admin/api/create-creation'

            const res = await fetch(apiEndpoint, {
                method: 'POST',
                body: formData
            })

            if (res.ok) {
                alert(`✓ ${mode === 'series' ? 'Collection' : 'Création'} "${fileData.result.title}" créée avec succès !`)
                removeFile(index)
            } else {
                throw new Error('Erreur création')
            }
        } catch (e) {
            console.error(e)
            alert('Erreur lors de la création')
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                status: 'pending' as const
            }))
            setFiles(prev => [...prev, ...newFiles])
        }
    }

    const handleUpdateResult = (index: number, newResult: AIResult) => {
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, result: newResult } : f))
    }

    const handleGenerateFromText = async (collectionName: string) => {
        setIsGeneratingFromText(true)
        try {
            const res = await fetch('/admin/api/generate-collection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collectionName })
            })

            if (!res.ok) throw new Error('Generation failed')

            const data = await res.json()

            // Afficher le prompt et les métadonnées à l'utilisateur
            alert(`✨ Collection générée avec succès!\n\n📝 Prompt d'image:\n${data.imagePrompt}\n\n🎨 Utilisez ce prompt avec votre outil de génération d'images préféré, puis uploadez l'image générée.`)

            // Afficher les métadonnées dans la console pour référence
            console.log('Collection Metadata:', {
                titleOptions: data.titleOptions,
                descriptionOptions: data.descriptionOptions
            })

        } catch (error) {
            console.error('Text generation error:', error)
            alert('Erreur lors de la génération de la collection')
        } finally {
            setIsGeneratingFromText(false)
        }
    }

    const reset = () => setFiles([])

    return (
        <div id="ai-ingestor-root" className="min-h-screen bg-zinc-950 font-sans text-zinc-100 p-8 antialiased selection:bg-rose-500/30">
            <div className="max-w-7xl mx-auto space-y-12">

                <IngestorHeader />

                <IngestorActions
                    filesCount={files.length}
                    mode={mode}
                    setMode={setMode}
                    onReset={reset}
                    onAnalyzeAll={analyzeAll}
                    onCreateAll={() => { }} // TODO: Implement create all
                />

                {/* Mode Selector Tabs (only for series/collection mode) */}
                {mode === 'series' && files.length === 0 && (
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setInputMode('image')}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${inputMode === 'image'
                                ? 'bg-rose-500 text-white shadow-lg'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            <Image size={20} />
                            Importer une image
                        </button>
                        <button
                            onClick={() => setInputMode('text')}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${inputMode === 'text'
                                ? 'bg-amber-500 text-black shadow-lg'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            <Type size={20} />
                            Créer par texte
                        </button>
                    </div>
                )}

                {/* Hidden file input (permanent) */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                />

                {/* Text Creation Mode */}
                {inputMode === 'text' && mode === 'series' && files.length === 0 && (
                    <TextCollectionCreator
                        onGenerate={handleGenerateFromText}
                        isGenerating={isGeneratingFromText}
                    />
                )}

                {/* Image Upload Mode - Drop Zone */}
                {inputMode === 'image' && files.length === 0 ? (
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-3xl h-[60vh] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group
                            ${isDragActive
                                ? 'border-amber-400 bg-amber-400/5 scale-[1.01] shadow-[0_0_100px_rgba(251,191,36,0.2)]'
                                : 'border-zinc-800 hover:border-rose-500/50 hover:bg-zinc-900/50'
                            }
                        `}
                    >
                        <input {...getInputProps()} />
                        <div className="relative p-12 rounded-full bg-zinc-900/80 mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-2xl">
                            <UploadCloud size={64} className={`text-zinc-500 transition-colors duration-500 ${isDragActive ? 'text-amber-400' : 'group-hover:text-rose-400'}`} />
                            <div className="absolute inset-0 border border-white/10 rounded-full animate-ping opacity-0 group-hover:opacity-20 duration-1000" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-zinc-300 group-hover:text-white transition-colors">
                            Glissez-déposez vos photos
                        </h2>
                        <p className="mt-4 text-zinc-500 font-mono text-sm tracking-widest uppercase group-hover:text-rose-400/80 transition-colors">
                            ou cliquez pour sélectionner
                        </p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            className="mt-12 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center gap-3"
                        >
                            <Plus size={20} />
                            IMPORTER DES PHOTOS
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-12">
                        <ul className="grid grid-cols-1 gap-16">
                            {files.map((fileData, index) => (
                                <FileItem
                                    key={index}
                                    file={fileData.file}
                                    index={index}
                                    result={fileData.result}
                                    isAnalyzing={fileData.status === 'analyzing'}
                                    onRemove={removeFile}
                                    onCreate={createEntry}
                                    mode={mode}
                                    onUpdateResult={handleUpdateResult}
                                />
                            ))}
                        </ul>

                        <div className="flex justify-center pb-24">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-all flex items-center gap-3 font-mono text-sm uppercase tracking-widest"
                            >
                                <Plus size={16} />
                                Ajouter d'autres photos
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
