'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@payloadcms/ui/elements/Button'

type AIResult = {
    title: string
    description: string
    price?: number
    alt?: string
    seriesMatch?: string
    error?: string
}

type Mode = 'series' | 'creation'

export const AIIngestor: React.FC = () => {
    const [mode, setMode] = useState<Mode>('series')
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [results, setResults] = useState<Record<number, AIResult>>({})
    const [progress, setProgress] = useState(0)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files))
            setResults({})
            setProgress(0)
        }
    }

    const startAnalysis = async () => {
        if (files.length === 0) return
        setIsProcessing(true)
        setProgress(0)

        const newResults: Record<number, AIResult> = {}

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            try {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('mode', mode)

                const response = await fetch('/admin/api/ai', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) throw new Error("Analyse échouée")
                const data = await response.json()
                newResults[i] = data
            } catch (err) {
                console.error(err)
                newResults[i] = { title: "Erreur", description: "Impossible d'analyser cette image.", error: String(err) }
            }
            setResults({ ...newResults })
            setProgress(Math.round(((i + 1) / files.length) * 100))
        }

        setIsProcessing(false)
    }

    const createEntry = async (index: number) => {
        const result = results[index]
        const file = files[index]
        if (!result || !file) return

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', result.title)
            formData.append('description', result.description)
            if (result.price) formData.append('price', String(result.price))
            if (result.alt) formData.append('alt', result.alt)
            if (result.seriesMatch) formData.append('seriesMatch', result.seriesMatch)

            const apiEndpoint = mode === 'series' ? '/admin/api/create-collection' : '/admin/api/create-creation'

            const res = await fetch(apiEndpoint, {
                method: 'POST',
                body: formData
            })

            if (res.ok) {
                const data = await res.json()
                // On marque comme fait ou on redirige
                alert('Entrée créée avec succès !')
            } else {
                throw new Error('Erreur création')
            }
        } catch (e) {
            console.error(e)
            alert('Erreur lors de la création')
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto pb-20">
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-serif mb-4 text-slate-800 dark:text-slate-100">
                    L'Atelier Intelligent
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto italic">
                    Laissez l'IA s'occuper des descriptions pendant que vous créez.
                </p>
            </header>

            <div className="flex justify-center gap-4 mb-10">
                <button
                    onClick={() => { setMode('series'); setFiles([]); setResults({}) }}
                    className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all ${mode === 'series' ? 'bg-slate-800 text-white scale-105' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                    ✨ Nouvelle Collection
                </button>
                <button
                    onClick={() => { setMode('creation'); setFiles([]); setResults({}) }}
                    className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all ${mode === 'creation' ? 'bg-slate-800 text-white scale-105' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                    🧵 Nouvelles Créations (Batch)
                </button>
            </div>

            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="p-12 text-center border-b border-slate-50 dark:border-slate-800">
                    <input
                        type="file"
                        accept="image/*"
                        multiple={mode === 'creation'}
                        onChange={handleFileChange}
                        className="hidden"
                        id="ai-upload-input"
                    />
                    <label htmlFor="ai-upload-input" className="group cursor-pointer block">
                        <div className="mx-auto w-24 h-24 mb-6 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
                            <span className="text-4xl group-hover:scale-110 transition-transform">📸</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Choisir vos photos</h3>
                        <p className="text-slate-400">
                            {mode === 'series' ? 'Une photo d\'ambiance' : 'Sélectionnez plusieurs photos de vos créations'}
                        </p>
                    </label>

                    {files.length > 0 && (
                        <div className="mt-10">
                            <p className="mb-6 font-bold text-slate-700 dark:text-slate-300">
                                {files.length} fichier(s) prêt(s) pour l'analyse
                            </p>
                            <Button size="large" onClick={startAnalysis} disabled={isProcessing}>
                                {isProcessing ? `Traitement en cours (${progress}%)` : "Lancer l'Analyse IA"}
                            </Button>
                        </div>
                    )}
                </div>

                {Object.keys(results).length > 0 && (
                    <div className="p-10 space-y-8 bg-slate-50/50 dark:bg-slate-950/50">
                        <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-4">Résultats de l'analyse</h2>
                        <div className="grid grid-cols-1 gap-8">
                            {files.map((file, idx) => {
                                const res = results[idx]
                                if (!res) return null
                                return (
                                    <article key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-md flex flex-col md:flex-row gap-8 border border-slate-100 dark:border-slate-800">
                                        <div className="w-full md:w-1/3 aspect-square relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Input"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            {res.error ? (
                                                <p className="text-red-500 font-bold">{res.error}</p>
                                            ) : (
                                                <>
                                                    <header className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100">{res.title}</h3>
                                                            {res.seriesMatch && (
                                                                <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest rounded mt-2">
                                                                    Collection : {res.seriesMatch}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {res.price && <div className="text-2xl font-bold text-emerald-600">{res.price} €</div>}
                                                    </header>

                                                    <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                                        {res.description}
                                                    </p>

                                                    {res.alt && (
                                                        <div className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                                                            <strong>SEO Alt :</strong> {res.alt}
                                                        </div>
                                                    )}

                                                    <div className="pt-6 flex gap-4">
                                                        <Button onClick={() => createEntry(idx)}>
                                                            Valider et Créer
                                                        </Button>
                                                        <Button buttonStyle="secondary">
                                                            Modifier
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}
