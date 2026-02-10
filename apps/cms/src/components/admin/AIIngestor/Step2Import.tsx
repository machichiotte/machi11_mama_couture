import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { IngestorFile } from './types'
import { DropzoneUI, FilePreviewGrid } from './ImportUI'
import { SeriesSelector } from './SeriesSelector'

interface Step2ImportProps {
    mode: 'series' | 'creation'
    onDrop: (files: File[]) => void
    files: IngestorFile[]
    onRemoveFile: (id: string) => void
    onMergeFiles: (sourceId: string, targetId: string) => void
    onAddFilesToItem: (id: string, files: File[]) => void
    onUpdateItemFields: (id: string, fields: Partial<Pick<IngestorFile, 'userTitle' | 'userDescription' | 'userSeries'>>) => void
    onStartAnalysis: (title?: string, desc?: string) => void
    series: { id: string | number, title: string }[]
}

export const Step2Import: React.FC<Step2ImportProps> = ({
    mode,
    onDrop,
    files,
    onRemoveFile,
    onMergeFiles,
    onAddFilesToItem,
    onUpdateItemFields,
    onStartAnalysis,
    series
}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true
    })

    const hasFiles = files.length > 0
    const selectedItem = files.find(f => f.id === selectedId)
    const selectedIndex = files.findIndex(f => f.id === selectedId)

    // Auto-select first item in series mode for immediate configuration
    React.useEffect(() => {
        if (mode === 'series' && hasFiles && !selectedId) {
            setSelectedId(files[0].id)
        }
    }, [mode, hasFiles, selectedId, files])

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!hasFiles ? (
                <div className="max-w-5xl mx-auto">
                    <DropzoneUI
                        isDragActive={isDragActive}
                        mode={mode}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr,0.8fr] gap-12 items-stretch">
                    <FilePreviewGrid
                        files={files}
                        onRemove={onRemoveFile}
                        onMerge={onMergeFiles}
                        onAddFiles={onAddFilesToItem}
                        onUpdateFields={onUpdateItemFields}
                        series={series}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        mode={mode}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />

                    <div className="ai-card ai-card-hover p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                        <div className="space-y-8 relative z-10">
                            {selectedItem ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent font-black text-xs">
                                                #{selectedIndex + 1}
                                            </div>
                                            <h3 className="text-sm font-black text-brand-accent uppercase tracking-[0.2em]">
                                                {mode === 'series' ? 'Série' : 'Création'}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setSelectedId(null)}
                                            className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                                        >
                                            × Fermer
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="ai-label ml-1">Titre Suggéré</label>
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Override</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={selectedItem.userTitle || ''}
                                                onChange={(e) => selectedId && onUpdateItemFields(selectedId, { userTitle: e.target.value })}
                                                placeholder="Laissez vide pour l'IA..."
                                                className="ai-input"
                                            />
                                        </div>

                                        {mode === 'creation' && (
                                            <SeriesSelector
                                                series={series}
                                                label="Rattacher à une Collection"
                                                value={selectedItem.userSeries}
                                                onChange={(val: string) => selectedId && onUpdateItemFields(selectedId, { userSeries: val })}
                                            />
                                        )}

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="ai-label ml-1">Instructions Spécifiques</label>
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Conseils</span>
                                            </div>
                                            <textarea
                                                value={selectedItem.userDescription || ''}
                                                onChange={(e) => selectedId && onUpdateItemFields(selectedId, { userDescription: e.target.value })}
                                                placeholder="Ex: Mettre en avant la texture de la laine..."
                                                rows={5}
                                                className="ai-input resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in duration-500">
                                    {mode === 'series' ? (
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="ai-label ml-1">Titre de la Collection (Optionnel)</label>
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
                                        <div className="space-y-8 mt-4">
                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                                <p className="text-brand-accent font-black text-xs uppercase tracking-widest">Conseil</p>
                                                <p className="text-white/60 text-sm leading-relaxed font-medium">
                                                    Sélectionnez une photo à gauche pour affiner le titre ou donner des instructions précises à l&apos;IA pour cet item.
                                                </p>
                                            </div>
                                            <p className="text-zinc-500 text-sm leading-relaxed font-medium px-4">
                                                L&apos;IA analysera automatiquement vos images, détectera le style Mama Couture et générera des fiches produits complètes.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="pt-8 relative z-10 border-t border-white/5 mt-8">
                            <button
                                onClick={() => onStartAnalysis(title, description)}
                                className="ai-button-primary w-full text-2xl group py-6"
                            >
                                <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                                {hasFiles ? `Analyser ${files.length} ${mode === 'series' ? 'Collection' : 'Création'}${files.length > 1 ? 's' : ''}` : "Lancer l'Analyse"}
                            </button>
                            <p className="mt-6 text-center text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-black opacity-60">
                                {selectedId ? "L'analyse utilisera vos réglages" : "L'intelligence artificielle définit le thème"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
