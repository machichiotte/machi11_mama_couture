'use client'

import React, { useState } from 'react'
import { Button } from '@payloadcms/ui/elements/Button'
import { Sparkles, Wand2 } from 'lucide-react'

interface TextCollectionCreatorProps {
    onGenerate: (collectionName: string) => void
    isGenerating: boolean
}

export const TextCollectionCreator: React.FC<TextCollectionCreatorProps> = ({
    onGenerate,
    isGenerating,
}) => {
    const [collectionName, setCollectionName] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (collectionName.trim()) {
            onGenerate(collectionName.trim())
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-rose-950/20 to-amber-950/20 border border-rose-200/10 rounded-3xl p-12 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500/10 rounded-full border border-amber-500/20 mb-6">
                        <Wand2 className="text-amber-400" size={24} />
                        <span className="text-amber-400 font-bold uppercase tracking-widest text-sm">
                            Création Magique
                        </span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-white mb-3">
                        Créer une collection par texte
                    </h2>
                    <p className="text-white/60 text-base leading-relaxed">
                        Décrivez votre collection en quelques mots, et l'IA générera une image d'ambiance vintage ainsi qu'une description élégante.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">
                            Nom de la collection
                        </label>
                        <input
                            type="text"
                            value={collectionName}
                            onChange={(e) => setCollectionName(e.target.value)}
                            placeholder="Ex: Bouillottes, Sacs d'été, Marque-pages..."
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all text-lg font-serif"
                            disabled={isGenerating}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={!collectionName.trim() || isGenerating}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30"
                    >
                        {isGenerating ? (
                            <span className="flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                Génération en cours...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-3">
                                <Sparkles size={20} />
                                Générer l'image et la collection
                            </span>
                        )}
                    </Button>
                </form>

                <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-white/40 leading-relaxed">
                        <strong className="text-white/60">💡 Astuce :</strong> L'IA créera automatiquement une illustration vintage dans le style catalogue ancien avec cadre ornemental, puis analysera cette image pour générer un titre et une description adaptés.
                    </p>
                </div>
            </div>
        </div>
    )
}
