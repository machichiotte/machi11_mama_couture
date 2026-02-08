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
                className="group relative p-12 ai-card ai-card-hover text-left shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-10 text-white/20 group-hover:text-brand-accent transition-colors duration-500">
                    <Library size={120} strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-black mb-4 text-white group-hover:text-brand-accent transition-colors tracking-tight">NOUVELLE COLLECTION</h2>
                <p className="text-zinc-400 group-hover:text-white transition-colors max-w-[18rem] leading-relaxed font-bold">
                    Créez une nouvelle série (ex: &quot;Collection Jardin Anglais&quot;) à partir d&apos;une photo d&apos;ambiance. L&apos;IA définit le thème et le style.
                </p>
            </button>

            <button
                onClick={() => onSelect('creation')}
                className="group relative p-12 ai-card ai-card-hover text-left shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-10 text-white/20 group-hover:text-brand-accent transition-colors duration-500">
                    <Shirt size={120} strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-black mb-4 text-white group-hover:text-brand-accent transition-colors tracking-tight">NOUVELLES CRÉATIONS</h2>
                <p className="text-zinc-400 group-hover:text-white transition-colors max-w-[18rem] leading-relaxed font-bold">
                    Ajoutez plusieurs produits (créations) à partir de vos photos. L&apos;IA les analyse et les range dans la bonne collection.
                </p>
            </button>
        </div>
    )
}
