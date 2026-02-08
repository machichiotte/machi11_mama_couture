import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { IngestorFile } from './types'
import { DropzoneUI, FilePreviewGrid } from './ImportUI'

interface Step2ImportProps {
    mode: 'series' | 'creation'
    onDrop: (files: File[]) => void
    files: IngestorFile[]
    onRemoveFile: (index: number) => void
    onStartAnalysis: (title?: string, desc?: string) => void
}

export const Step2Import: React.FC<Step2ImportProps> = ({ mode, onDrop, files, onRemoveFile, onStartAnalysis }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: mode === 'creation'
    })

    const hasFiles = files.length > 0

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!hasFiles ? (
                <DropzoneUI
                    isDragActive={isDragActive}
                    mode={mode}
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    <FilePreviewGrid
                        files={files}
                        onRemove={onRemoveFile}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        mode={mode}
                    />

                    <div className="ai-card ai-card-hover p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                        <div className="space-y-8 relative z-10">
                            {mode === 'series' ? (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="ai-label ml-1">Titre (Optionnel)</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Ex: Collection Jardin Secret"
                                            className="ai-input"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="ai-label ml-1">Description (Optionnelle)</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Brief rapide pour l'IA..."
                                            rows={4}
                                            className="ai-input resize-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-zinc-400 group-hover:text-white font-bold leading-relaxed transition-colors">
                                    L&apos;intelligence artificielle va analyser vos photos de produits pour en extraire les caractéristiques, le style et les classer automatiquement.
                                </p>
                            )}
                        </div>

                        <div className="pt-8 relative z-10">
                            <button
                                onClick={() => onStartAnalysis(title, description)}
                                className="ai-button-primary w-full text-2xl group"
                            >
                                <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                                Lancer l&apos;Analyse
                            </button>
                            <p className="mt-6 text-center text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-black opacity-60">
                                L&apos;intelligence artificielle définit le thème
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
