'use client'

import React, { useState } from 'react'
import { Button } from '@payloadcms/ui/elements/Button'

export const AIIngestor: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsProcessing(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/admin/api/ai', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('Erreur lors de l\'analyse')

            const data = await response.json()
            setResult(data)
        } catch (err) {
            console.error(err)
            alert('Une erreur est survenue lors de l\'analyse.')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif mb-6 text-slate-800 dark:text-slate-100">
                L'Atelier Couturier (IA)
            </h1>
            <p className="mb-8 text-slate-600 dark:text-slate-300 max-w-2xl">
                Déposez une photo d'ambiance ou de vos tissus. L'assistant va imaginer pour vous
                le titre et l'histoire de cette future collection.
            </p>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center bg-slate-50/50 dark:bg-slate-900/50">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    id="ai-upload"
                />
                <label htmlFor="ai-upload" className="cursor-pointer">
                    <div className="mx-auto w-20 h-20 mb-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-2xl">📷</span>
                    </div>
                    <span className="premium-button inline-block px-6 py-3 font-bold uppercase tracking-widest text-sm">
                        {isProcessing ? 'Analyse en cours...' : 'Analyser une photo'}
                    </span>
                </label>
            </div>

            {result && (
                <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-emerald-800 dark:text-emerald-400">Suggestion de l'Atelier</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wide font-bold mb-1 opacity-70">Titre</label>
                            <p className="text-lg font-serif">{result.title}</p>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wide font-bold mb-1 opacity-70">Histoire</label>
                            <p className="italic text-slate-600 dark:text-slate-300">{result.description}</p>
                        </div>
                        <div className="pt-4">
                            <Button
                                onClick={async () => {
                                    try {
                                        if (!result || !result.title) return

                                        const fileInput = document.getElementById('ai-upload') as HTMLInputElement
                                        const file = fileInput?.files?.[0]
                                        if (!file) {
                                            alert('Veuillez re-sélectionner l\'image.')
                                            return
                                        }

                                        const formData = new FormData()
                                        formData.append('file', file)
                                        formData.append('title', result.title)
                                        formData.append('description', result.description)

                                        const res = await fetch('/admin/api/create-collection', {
                                            method: 'POST',
                                            body: formData
                                        })

                                        if (res.ok) {
                                            const data = await res.json()
                                            window.location.href = data.url
                                        } else {
                                            throw new Error('Erreur création')
                                        }
                                    } catch (e) {
                                        console.error(e)
                                        alert('Erreur lors de la création')
                                    }
                                }}
                            >
                                Créer cette Collection
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
