import React, { useState } from 'react'
import { UploadCloud, X, Copy, Sparkles } from 'lucide-react'
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone'
import { IngestorFile } from './types'
import { SeriesSelector } from './SeriesSelector'

interface DropzoneUIProps {
    isDragActive: boolean
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T
    mode: 'series' | 'creation'
}

export const DropzoneUI: React.FC<DropzoneUIProps> = ({ isDragActive, getRootProps, getInputProps, mode }) => (
    <div
        {...getRootProps()}
        className={`
            ai-card p-16 border-2 border-dashed transition-all duration-500 cursor-pointer
            flex flex-col items-center justify-center min-h-[500px] text-center
            ${isDragActive ? 'border-brand-accent bg-brand-accent/5 scale-105' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
        `}
    >
        <input {...getInputProps()} />
        <div className="relative mb-10">
            <div className={`
                p-10 rounded-full transition-transform duration-500
                ${isDragActive ? 'bg-brand-accent text-black scale-110 rotate-12' : 'bg-white/5 text-zinc-400 group-hover:scale-110'}
            `}>
                <UploadCloud size={64} strokeWidth={1.5} />
            </div>
            {isDragActive && (
                <div className="absolute -inset-4 bg-brand-accent/20 rounded-full animate-ping" />
            )}
        </div>
        <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">
            {isDragActive ? 'Déposez ici' : 'Ajoutez vos pépites'}
        </h2>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            {mode === 'series' ? 'Faites glisser une image pour créer une collection' : 'Glissez-déposez vos créations'}
        </p>
    </div>
)

interface FilePreviewGridProps {
    files: IngestorFile[]
    onRemove: (id: string) => void
    onMerge: (sourceId: string, targetId: string) => void
    onAddFiles: (id: string, files: File[]) => void
    onUpdateFields: (id: string, fields: Partial<IngestorFile>) => void
    series: { id: string | number, title: string }[]
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T
    mode: 'series' | 'creation'
    selectedId: string | null
    onSelect: (id: string | null) => void
}

export const FilePreviewGrid: React.FC<FilePreviewGridProps> = ({
    files,
    onRemove,
    onMerge,
    onAddFiles,
    onUpdateFields,
    series,
    getRootProps,
    getInputProps,
    mode,
    selectedId,
    onSelect
}) => {
    const [dragOverId, setDragOverId] = useState<string | null>(null)

    const handleDragStart = (e: React.DragEvent, id: string) => {
        console.log('Drag Start:', id)
        e.stopPropagation()
        e.dataTransfer.setData('text/plain', id)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOverId(null)

        // Disable merging and multi-image grouping in series mode
        if (mode === 'series') return

        // Handle external files from OS
        const droppedFiles = Array.from(e.dataTransfer.files)
        if (droppedFiles.length > 0) {
            onAddFiles(targetId, droppedFiles)
            return
        }

        // Handle internal drag
        const sourceId = e.dataTransfer.getData('text/plain')
        if (sourceId && sourceId !== targetId) {
            onMerge(sourceId, targetId)
        }
    }

    return (
        <div className="ai-card ai-card-hover p-8 flex flex-col justify-center min-h-[500px]">
            <div className={`grid grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in duration-700`}>
                {files.map((fileData, index) => {
                    const mainFile = fileData.files[0]
                    const count = fileData.files.length
                    const isSelected = selectedId === fileData.id

                    return (
                        <div
                            key={fileData.id}
                            draggable={mode === 'creation'}
                            onDragStart={(e) => mode === 'creation' && handleDragStart(e, fileData.id)}
                            onDragOver={(e) => {
                                if (mode === 'series') return;
                                e.preventDefault();
                                e.stopPropagation();
                                e.dataTransfer.dropEffect = 'move';
                                if (dragOverId !== fileData.id) setDragOverId(fileData.id);
                            }}
                            onDragLeave={(e) => {
                                if (mode === 'series') return;
                                e.preventDefault();
                                e.stopPropagation();
                                setDragOverId(null);
                            }}
                            onDrop={(e) => handleDrop(e, fileData.id)}
                            onClick={() => onSelect(isSelected ? null : fileData.id)}
                            className={`
                                relative group rounded-2xl transition-all duration-300 cursor-pointer
                                ${dragOverId === fileData.id ? 'scale-110 ring-2 ring-brand-accent shadow-[0_0_30px_rgba(244,208,63,0.3)] z-50' : 'z-0'}
                                aspect-square
                                ${isSelected ? 'ring-4 ring-brand-accent shadow-[0_0_50px_rgba(244,208,63,0.4)] z-50 scale-105' : 'hover:scale-[1.02]'}
                            `}
                        >
                            {/* Numbering Badge */}
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-zinc-900/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-[10px] font-black text-brand-accent z-30 shadow-xl group-hover:scale-110 transition-transform">
                                #{index + 1}
                            </div>

                            {/* Pile Effect */}
                            {count > 1 && (
                                <>
                                    <div className="absolute inset-0 rotate-2 translate-x-1 translate-y-1 bg-white/5 border border-white/10 rounded-2xl -z-10" />
                                    <div className="absolute inset-0 -rotate-2 -translate-x-1 translate-y-1 bg-white/5 border border-white/10 rounded-2xl -z-20" />
                                </>
                            )}

                            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl relative">
                                <>
                                    <img
                                        src={URL.createObjectURL(mainFile)}
                                        alt="Preview"
                                        draggable={false}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {count > 1 && (
                                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-1.5 z-10">
                                            <Copy size={10} className="text-brand-accent" />
                                            <span className="text-[10px] font-black text-white">{count}</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onSelect(fileData.id); }}
                                            className="w-10 h-10 bg-brand-accent text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                            title="Personnaliser"
                                        >
                                            <Sparkles size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onRemove(fileData.id); }}
                                            className="w-10 h-10 bg-zinc-800 text-white hover:bg-red-500/20 hover:text-red-500 rounded-full flex items-center justify-center transition-all border border-white/10 shadow-xl"
                                            title="Supprimer"
                                        >
                                            <X size={18} strokeWidth={3} />
                                        </button>
                                    </div>

                                    {(fileData.userTitle || fileData.userSeries) && (
                                        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
                                            {fileData.userTitle && (
                                                <span className="px-2 py-1 bg-brand-accent text-black text-[8px] font-black uppercase rounded shadow-lg truncate max-w-full">
                                                    {fileData.userTitle}
                                                </span>
                                            )}
                                            {fileData.userSeries && (
                                                <span className="px-2 py-1 bg-zinc-900/90 text-zinc-300 text-[8px] font-bold uppercase rounded border border-white/10 shadow-lg truncate max-w-full">
                                                    {fileData.userSeries}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </>
                            </div>
                        </div>
                    )
                })}
                {mode === 'creation' && (
                    <div
                        {...getRootProps()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-zinc-800 hover:border-brand-accent/50 hover:bg-zinc-800/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                    >
                        <input {...getInputProps()} />
                        <UploadCloud size={32} className="text-zinc-600 group-hover:text-brand-accent mb-2 transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center px-4">Ajouter des photos</span>
                    </div>
                )}
            </div>
            <p className="mt-8 text-center text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
                {files.reduce((acc, f) => acc + f.files.length, 0)} photo{files.reduce((acc, f) => acc + f.files.length, 0) > 1 ? 's' : ''} dans {files.length} création{files.length > 1 ? 's' : ''}
            </p>
        </div>
    )
}
