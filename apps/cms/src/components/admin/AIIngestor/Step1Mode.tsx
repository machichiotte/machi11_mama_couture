import React from 'react'
import { Library, Shirt } from 'lucide-react'

interface Step1ModeProps {
    onSelect: (mode: 'series' | 'creation') => void
}

export const Step1Mode: React.FC<Step1ModeProps> = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <button
                onClick={() => onSelect('series')}
                className="group relative p-12 bg-zinc-900/80 border border-white/10 rounded-[3rem] text-left hover:border-rose-500/50 hover:bg-zinc-800/40 transition-all duration-500 overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-10 text-white/20 group-hover:text-rose-500/30 transition-colors duration-500">
                    <Library size={120} strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-black mb-4 group-hover:text-rose-400 transition-colors tracking-tight">NOUVELLE COLLECTION</h2>
                <p className="text-zinc-400 group-hover:text-zinc-200 transition-colors max-w-[18rem] leading-relaxed font-bold">
                    Créez une nouvelle série (ex: "Collection Jardin Anglais") à partir d'une photo d'ambiance. L'IA définit le thème et le style.
                </p>
            </button>

            <button
                onClick={() => onSelect('creation')}
                className="group relative p-12 bg-zinc-900/80 border border-white/10 rounded-[3rem] text-left hover:border-amber-500/50 hover:bg-zinc-800/40 transition-all duration-500 overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-10 text-white/20 group-hover:text-amber-500/30 transition-colors duration-500">
                    <Shirt size={120} strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-black mb-4 group-hover:text-amber-400 transition-colors tracking-tight">NOUVELLES CRÉATIONS</h2>
                <p className="text-zinc-400 group-hover:text-zinc-200 transition-colors max-w-[18rem] leading-relaxed font-bold">
                    Ajoutez plusieurs produits (créations) à partir de vos photos. L'IA les analyse et les range dans la bonne collection.
                </p>
            </button>
        </div>
    )
}
