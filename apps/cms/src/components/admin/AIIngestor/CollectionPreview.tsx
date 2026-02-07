
import React from 'react'
import { Check, Sparkles, RefreshCw } from 'lucide-react'

interface CollectionPreviewProps {
    data: any
    onValidate: () => void
    onRetry: () => void
}

export const CollectionPreview: React.FC<CollectionPreviewProps> = ({ data, onValidate, onRetry }) => {
    const { series, metadata } = data

    return (
        <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Section */}
                <div className="relative h-96 md:h-auto bg-zinc-950 flex items-center justify-center p-8 group">
                    {/* Background decorations */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/30 via-zinc-950 to-zinc-950" />

                    {series.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={
                                typeof series.coverImage === 'object' && series.coverImage?.url
                                    ? series.coverImage.url
                                    : `/api/media/${series.coverImage}`
                            }
                            alt={series.title}
                            className="relative w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="text-zinc-700 flex flex-col items-center">
                            <Sparkles size={48} className="mb-4 opacity-20" />
                            <span>Aucune image générée</span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-zinc-900/50 backdrop-blur-3xl">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest mb-4 border border-amber-500/20">
                            Collection Générée
                        </span>
                        <h2 className="text-4xl font-serif font-bold text-white mb-4 leading-tight">
                            {series.title}
                        </h2>
                        <div className="h-1 w-20 bg-rose-500 rounded-full mb-6" />
                        <p className="text-zinc-400 text-lg leading-relaxed font-light">
                            {series.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={onValidate}
                            className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 group"
                        >
                            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                                <Check size={16} strokeWidth={3} />
                            </span>
                            VALIDER LA COLLECTION
                        </button>

                        <button
                            onClick={onRetry}
                            className="w-full py-4 bg-transparent border border-white/10 text-zinc-500 font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Recommencer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
