import React from 'react'
import { Button } from '@payloadcms/ui/elements/Button'

interface IngestorActionsProps {
    filesCount: number
    isProcessing: boolean
    hasAnalysisPending: boolean
    hasCreationPending: boolean
    onReset: () => void
    onStartAnalysis: () => void
    onCreate: () => void
    mode: 'series' | 'creation'
}

export const IngestorActions: React.FC<IngestorActionsProps> = ({
    filesCount,
    isProcessing,
    hasAnalysisPending,
    hasCreationPending,
    onReset,
    onStartAnalysis,
    onCreate,
    mode,
}) => (
    <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-white">{filesCount} photo(s) prête(s)</h3>
            <span className="text-xs text-rose-400/80 font-medium uppercase tracking-wider">
                ✨ Mode : {mode === 'series' ? 'Nouvelle Collection' : 'Nouvelles Créations'}
            </span>
        </div>
        <div className="flex gap-2">
            <Button
                onClick={onReset}
                buttonStyle="none"
                className="text-white/40 hover:text-white/80 transition-colors"
            >
                Réinitialiser
            </Button>
            {hasAnalysisPending && (
                <Button
                    onClick={onStartAnalysis}
                    disabled={isProcessing}
                    className="min-w-[140px] bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                >
                    {isProcessing ? 'Analyse...' : `Analyser (${filesCount})`}
                </Button>
            )}
            {hasCreationPending && (
                <Button
                    onClick={onCreate}
                    disabled={isProcessing}
                    buttonStyle="primary"
                    className="min-w-[140px] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                    {mode === 'series' ? 'Créer la Collection' : 'Créer les Produits'}
                </Button>
            )}
        </div>
    </div>
)
