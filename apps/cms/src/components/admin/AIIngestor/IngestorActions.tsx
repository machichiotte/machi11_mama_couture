import React from 'react'
import { Library, Shirt, Sparkles, CheckCircle2 } from 'lucide-react'

interface IngestorActionsProps {
    filesCount: number
    mode: 'series' | 'creation'
    setMode: (mode: 'series' | 'creation') => void
    onAnalyzeAll: () => void
    onCreateAll: () => void
    hideModeSelector?: boolean
    hideAnalyzeAll?: boolean
    analyzingCount?: number
}

export const IngestorActions: React.FC<IngestorActionsProps> = ({
    filesCount,
    mode,
    setMode,
    onAnalyzeAll,
    onCreateAll,
    hideModeSelector = false,
    hideAnalyzeAll = false,
    analyzingCount = 0
}) => (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-brand-border pb-10">
        <div className="flex items-center gap-6">
            {mode === 'series' ? (
                filesCount > 0 && (
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-brand-accent">1</span> image sélectionnée
                    </h3>
                )
            ) : (
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-brand-accent">{filesCount}</span> photo(s) prête(s)
                </h3>
            )}

            {!hideModeSelector && (
                <div className="flex bg-brand-border p-1 rounded-xl border border-brand-border ml-4">
                    <button
                        onClick={() => setMode('series')}
                        className={`ai-button-secondary ${mode === 'series' ? 'ai-button-active' : ''}`}
                    >
                        <Library size={16} />
                        COLLECTION
                    </button>
                    <button
                        onClick={() => setMode('creation')}
                        className={`ai-button-secondary ${mode === 'creation' ? 'ai-button-active' : ''}`}
                    >
                        <Shirt size={16} />
                        CRÉATIONS
                    </button>
                </div>
            )}
        </div>

        <div className="flex gap-4">
            {!hideAnalyzeAll && (
                <button
                    onClick={onAnalyzeAll}
                    className="ai-button-secondary border border-brand-accent/30 hover:border-brand-accent/60"
                >
                    <Sparkles size={16} />
                    ANALYSER TOUT
                </button>
            )}

            {analyzingCount > 0 ? (
                <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-full border border-white/5 animate-pulse">
                    <div className="w-5 h-5 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                        {analyzingCount} Analyse{analyzingCount > 1 ? 's' : ''} en cours
                    </span>
                </div>
            ) : (
                filesCount > 0 && (
                    <button
                        onClick={onCreateAll}
                        className="ai-button-primary px-8"
                    >
                        <CheckCircle2 size={16} />
                        TOUT CRÉER
                    </button>
                )
            )}
        </div>
    </div>
)
