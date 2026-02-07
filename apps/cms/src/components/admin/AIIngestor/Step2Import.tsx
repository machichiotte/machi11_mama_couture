import React from 'react'
import { UploadCloud, Sparkles, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { IngestorFile } from './types'

interface Step2ImportProps {
    mode: 'series' | 'creation'
    onDrop: (files: File[]) => void
    files: IngestorFile[]
    onRemoveFile: (index: number) => void
    onStartAnalysis: (title?: string, desc?: string) => void
}

export const Step2Import: React.FC<Step2ImportProps> = ({ mode, onDrop, files, onRemoveFile, onStartAnalysis }) => {
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: mode === 'creation'
    })

    const hasFiles = files.length > 0

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!hasFiles ? (
                <div
                    {...getRootProps()}
                    className={`
                        bg-zinc-900/80 border-2 border-dashed border-white/10 rounded-[3rem] h-[50vh] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group
                        ${isDragActive
                            ? 'border-rose-500 bg-rose-500/5 scale-[1.01] shadow-[0_0_100px_rgba(244,63,94,0.2)]'
                            : 'hover:border-rose-500/50 hover:bg-zinc-800/80 shadow-2xl'
                        }
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="relative p-10 rounded-full bg-zinc-900/80 mb-8 border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <UploadCloud size={60} className="text-zinc-500 group-hover:text-rose-500 transition-colors" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-4 uppercase">
                        {mode === 'series' ? 'Photo d\'ambiance' : 'Photos de produits'}
                    </h2>
                    <p className="text-zinc-500 text-sm uppercase tracking-[0.3em] font-bold">
                        Glissez une image ou cliquez pour choisir
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Preview Area - Plus grand et mieux centré */}
                    <div className="bg-zinc-900/80 border border-white/10 rounded-[3rem] p-8 flex flex-col justify-center min-h-[500px]">
                        <div className={`grid ${files.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-4 w-full`}>
                            {files.map((f, i) => (
                                <div key={i} className={`group relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl ${files.length === 1 ? 'aspect-square max-w-sm mx-auto' : 'aspect-square'}`}>
                                    <img
                                        src={URL.createObjectURL(f.file)}
                                        alt="Machi Image Preview"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onRemoveFile(i); }}
                                            className="p-3 bg-white text-black hover:bg-rose-500 hover:text-white rounded-full transition-all shadow-xl border-none outline-none"
                                        >
                                            <X size={20} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {mode === 'creation' && (
                                <div
                                    {...getRootProps()}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-zinc-800 hover:border-rose-500/50 hover:bg-zinc-800/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                >
                                    <input {...getInputProps()} />
                                    <UploadCloud size={32} className="text-zinc-600 group-hover:text-rose-500 mb-2 transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ajouter</span>
                                </div>
                            )}
                        </div>
                        <p className="mt-6 text-center text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
                            {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Options Area - Style identique à Step 1 */}
                    <div className="bg-zinc-900/80 border border-white/10 rounded-[3rem] p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                        <div className="space-y-8 relative z-10">

                            {mode === 'series' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] ml-1">Titre (Optionnel)</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Ex: Collection Jardin Secret"
                                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-rose-500/50 transition-all text-white font-bold placeholder:text-zinc-700 text-base"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] ml-1">Description (Optionnelle)</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Brief rapide pour l'IA..."
                                            rows={4}
                                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-rose-500/50 transition-all text-white font-bold placeholder:text-zinc-700 resize-none text-base"
                                        />
                                    </div>
                                </div>
                            )}

                            {mode !== 'series' && (
                                <p className="text-zinc-400 font-bold leading-relaxed">
                                    L'intelligence artificielle va analyser vos photos de produits pour en extraire les caractéristiques, le style et les classer automatiquement.
                                </p>
                            )}
                        </div>

                        <div className="pt-8 relative z-10">
                            <button
                                onClick={() => onStartAnalysis(title, description)}
                                className="w-full py-6 bg-white text-black hover:bg-rose-500 hover:text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 text-2xl group active:scale-95 border-none outline-none"
                            >
                                <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                                Lancer l'Analyse
                            </button>
                            <p className="mt-6 text-center text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-black opacity-60">
                                L'intelligence artificielle définit le thème
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
