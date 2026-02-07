import React from 'react'

export const IngestorHeader: React.FC = () => (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div className="flex items-center gap-6 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Atelier <span className="text-rose-500">Petit Point</span>
                </h1>
            </div>
            <p className="text-white/60 text-base md:text-lg font-medium max-w-3xl leading-relaxed italic border-l-2 border-rose-400/20 pl-6">
                Votre assistant créatif pour transformer vos photos en collections et créations prêtes à publier.
            </p>
        </div>
    </div>
)
