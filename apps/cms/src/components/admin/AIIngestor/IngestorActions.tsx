import React from 'react'
import { Button } from '@payloadcms/ui/elements/Button'
import { Library, Shirt, ArrowLeft } from 'lucide-react'

interface IngestorActionsProps {
    filesCount: number
    mode: 'series' | 'creation'
    setMode: (mode: 'series' | 'creation') => void
    onReset: () => void
    onAnalyzeAll: () => void
    onCreateAll: () => void
    hideModeSelector?: boolean
    hideActions?: boolean
    onBack?: () => void
}

export const IngestorActions: React.FC<IngestorActionsProps> = ({
    filesCount,
    mode,
    setMode,
    onReset,
    onAnalyzeAll,
    onCreateAll,
    hideModeSelector = false,
    hideActions = false,
    onBack
}) => (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-10">
        <div className="flex items-center gap-6">
            {mode === 'series' ? (
                filesCount > 0 && (
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-rose-500">1</span> image sélectionnée
                    </h3>
                )
            ) : (
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-amber-500">{filesCount}</span> photo(s) prête(s)
                </h3>
            )}

            {!hideModeSelector && (
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 ml-4">
                    <button
                        onClick={() => setMode('series')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'series'
                            ? 'bg-rose-500 text-white shadow-lg'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Library size={16} />
                        COLLECTION
                    </button>
                    <button
                        onClick={() => setMode('creation')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'creation'
                            ? 'bg-amber-500 text-black shadow-lg'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Shirt size={16} />
                        CRÉATIONS
                    </button>
                </div>
            )}
        </div>

        <div className="flex items-center gap-4">
            {filesCount > 0 && onCreateAll && (
                <Button
                    onClick={onCreateAll}
                    className="px-12 py-4 bg-white text-black hover:bg-rose-500 hover:text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all hover:scale-[1.02] border-none"
                >
                    Tout Créer ({filesCount})
                </Button>
            )}
        </div>
    </div>
)
