import React from 'react'
import { Button } from '@payloadcms/ui/elements/Button'
import { Sparkles, Package } from 'lucide-react'

interface IngestorActionsProps {
    filesCount: number
    mode: 'series' | 'creation'
    setMode: (mode: 'series' | 'creation') => void
    onReset: () => void
    onAnalyzeAll: () => void
    onCreateAll: () => void
}

export const IngestorActions: React.FC<IngestorActionsProps> = ({
    filesCount,
    mode,
    setMode,
    onReset,
    onAnalyzeAll,
    onCreateAll,
}) => (
    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-4 w-full md:w-auto">
            <h3 className="text-xl font-bold text-white font-serif flex items-center gap-3">
                <span className="text-amber-500">{filesCount}</span> photo(s) prête(s)
            </h3>

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                <button
                    onClick={() => setMode('series')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'series'
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/20'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Sparkles size={16} />
                    NOUVELLE COLLECTION
                </button>
                <button
                    onClick={() => setMode('creation')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'creation'
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-900/20'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Package size={16} />
                    NOUVELLES CRÉATIONS
                </button>
            </div>
        </div>

        <div className="flex gap-4 items-center">
            {filesCount > 0 && (
                <>
                    <button
                        onClick={onReset}
                        className="text-xs font-mono text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors px-4 py-2"
                    >
                        Réinitialiser
                    </button>

                    <Button
                        onClick={onAnalyzeAll}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold"
                    >
                        ✨ Analyser tout
                    </Button>
                </>
            )}

            {filesCount > 1 && (
                <Button
                    onClick={onCreateAll}
                    className="bg-white text-black hover:bg-zinc-200 font-bold"
                >
                    Créer {mode === 'series' ? 'la Collection' : 'les Produits'}
                </Button>
            )}
        </div>
    </div>
)
