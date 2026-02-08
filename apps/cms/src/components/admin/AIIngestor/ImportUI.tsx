import React from 'react'
import { UploadCloud, X } from 'lucide-react'
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone'

interface DropzoneUIProps {
    isDragActive: boolean
    mode: 'series' | 'creation'
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T
}

export const DropzoneUI: React.FC<DropzoneUIProps> = ({ isDragActive, mode, getRootProps, getInputProps }) => (
    <div
        {...getRootProps()}
        className={`
            ai-card h-[50vh] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group
            ${isDragActive
                ? 'border-brand-accent bg-brand-accent/5 scale-[1.01] shadow-[0_0_100px_rgba(244,208,63,0.2)]'
                : 'ai-card-hover shadow-2xl'
            }
        `}
    >
        <input {...getInputProps()} />
        <div className="relative p-10 rounded-full bg-black/20 mb-8 border border-white/5 shadow-2xl group-hover:scale-110 group-hover:bg-brand-accent/10 transition-all duration-500">
            <UploadCloud size={60} className="text-zinc-500 group-hover:text-brand-accent transition-colors" />
        </div>
        <h2 className="text-3xl font-black text-white group-hover:text-brand-accent tracking-tight mb-4 uppercase transition-colors">
            {mode === 'series' ? "Photo d'ambiance" : "Photos de produits"}
        </h2>
        <p className="text-zinc-500 group-hover:text-white text-sm uppercase tracking-[0.3em] font-bold transition-colors">
            Glissez une image ou cliquez pour choisir
        </p>
    </div>
)

interface FilePreviewGridProps {
    files: Array<{ file: File }>
    onRemove: (index: number) => void
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T
    mode: 'series' | 'creation'
}

export const FilePreviewGrid: React.FC<FilePreviewGridProps> = ({ files, onRemove, getRootProps, getInputProps, mode }) => (
    <div className="ai-card ai-card-hover p-8 flex flex-col justify-center min-h-[500px]">
        <div className={`grid ${files.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-4 w-full`}>
            {files.map((f, i) => (
                <div key={i} className={`group relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl ${files.length === 1 ? 'aspect-square max-w-sm mx-auto' : 'aspect-square'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={URL.createObjectURL(f.file)}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                            className="p-3 bg-white text-black hover:bg-brand-accent hover:text-black rounded-full transition-all shadow-xl border-none outline-none"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            ))}
            {mode === 'creation' && (
                <div
                    {...getRootProps()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-zinc-800 hover:border-brand-accent/50 hover:bg-zinc-800/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                >
                    <input {...getInputProps()} />
                    <UploadCloud size={32} className="text-zinc-600 group-hover:text-brand-accent mb-2 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ajouter</span>
                </div>
            )}
        </div>
        <p className="mt-6 text-center text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
            {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
        </p>
    </div>
)
