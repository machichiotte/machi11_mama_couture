'use client'

import React, { useState, useRef } from 'react'
import { toast } from '@payloadcms/ui'
import { Stepper } from './Stepper'
import { IngestorActions } from './IngestorActions'
import { Step1Mode } from './Step1Mode'
import { Step2Import } from './Step2Import'
import { Step3Validation } from './Step3Validation'
import { AIResult, IngestorFile } from './types'

export const AIIngestor: React.FC = () => {
    const [step, setStep] = useState<number>(1)
    const [mode, setMode] = useState<'series' | 'creation'>('creation')
    const [files, setFiles] = useState<IngestorFile[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onDrop = (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            status: 'pending' as const
        }))
        setFiles(prev => [...prev, ...newFiles])
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onDrop(Array.from(e.target.files))
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => {
            const newFiles = prev.filter((_, i) => i !== index)
            if (newFiles.length === 0 && step === 3) {
                setStep(2)
            }
            return newFiles
        })
    }

    const analyzeFile = async (index: number, userTitle?: string, userDescription?: string) => {
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'analyzing' } : f))

        const fileData = files[index]
        const formData = new FormData()
        formData.append('file', fileData.file)
        formData.append('mode', mode)

        if (userTitle) formData.append('userTitle', userTitle)
        if (userDescription) formData.append('userDescription', userDescription)

        try {
            const res = await fetch('/admin/api/ai', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()

            let defaultTitle = data.title
            let defaultDescription = data.description

            if (data.titleOptions && data.descriptionOptions) {
                const defaultType = mode === 'series' ? 'theme' : 'object'
                defaultTitle = data.titleOptions[defaultType]
                defaultDescription = data.descriptionOptions[defaultType]
            }

            setFiles(prev => prev.map((f, i) => i === index ? {
                ...f,
                status: 'complete',
                result: {
                    ...data,
                    title: defaultTitle,
                    description: defaultDescription
                }
            } : f))
        } catch (e) {
            setFiles(prev => prev.map((f, i) => i === index ? {
                ...f,
                status: 'error',
                result: { title: '', description: '', error: 'Erreur analyse IA' }
            } : f))
        }
    }

    const analyzeAll = () => {
        files.forEach((file, index) => {
            if (file.status === 'pending') {
                analyzeFile(index)
            }
        })
    }

    const createEntry = async (index: number) => {
        const fileData = files[index]
        if (!fileData.result || !fileData.file) return

        try {
            const formData = new FormData()
            formData.append('file', fileData.file)
            formData.append('title', fileData.result.title)
            formData.append('description', fileData.result.description)
            formData.append('mode', mode)

            const res = await fetch('/admin/api/generate-collection', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error('Failed to create')

            toast.success(`${mode === 'series' ? 'Série' : 'Création'} créée avec succès !`)
            removeFile(index)
        } catch (e) {
            toast.error(`Erreur lors de la création : ${e instanceof Error ? e.message : 'Erreur inconnue'}`)
        }
    }

    const createAll = async () => {
        for (let i = files.length - 1; i >= 0; i--) {
            if (files[i].status === 'complete') {
                await createEntry(i)
            }
        }
    }

    const handleUpdateResult = (index: number, newResult: AIResult) => {
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, result: newResult } : f))
    }

    const handleStartAnalysis = (userTitle?: string, userDescription?: string) => {
        setStep(3)
        files.forEach((file, index) => {
            if (file.status === 'pending') {
                analyzeFile(index, userTitle, userDescription)
            }
        })
    }

    const reset = () => {
        setFiles([])
        setStep(1)
        setMode('creation')
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
            if (step === 2) setFiles([])
        }
    }

    const STEPS = [
        { label: 'MODE', description: step === 1 ? 'COLLECTION OU CRÉATIONS' : (mode === 'series' ? 'COLLECTION' : 'CRÉATIONS') },
        { label: 'IMPORT', description: 'IMAGE(S)' },
        { label: 'VALIDATION', description: 'VÉRIFICATION ET CRÉATION' }
    ]

    return (
        <div className="min-h-screen bg-black text-white p-12 font-sans selection:bg-rose-500/30">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header Section */}
                <div className="space-y-8 text-center">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                        Atelier <span className="text-rose-500">Petit Point</span>
                    </h1>
                    <div className="flex justify-center">
                        <p className="text-zinc-500 text-sm uppercase tracking-[0.3em] max-w-2xl font-bold leading-relaxed border-y border-white/5 py-4 text-center">
                            Votre assistant créatif pour transformer vos photos en collections et créations prêtes à publier.
                        </p>
                    </div>
                </div>

                <Stepper
                    currentStep={step}
                    steps={STEPS}
                    onBack={step > 1 ? handleBack : undefined}
                />

                {/* Step Content */}
                {step === 1 && (
                    <Step1Mode onSelect={(m) => { setMode(m); setStep(2); }} />
                )}

                {step === 2 && (
                    <Step2Import
                        mode={mode}
                        onDrop={onDrop}
                        files={files}
                        onRemoveFile={removeFile}
                        onStartAnalysis={handleStartAnalysis}
                    />
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <IngestorActions
                            filesCount={files.length}
                            mode={mode}
                            setMode={setMode}
                            onReset={reset}
                            onAnalyzeAll={analyzeAll}
                            onCreateAll={createAll}
                            hideModeSelector={true}
                            hideActions={files.length === 0}
                        />
                        <Step3Validation
                            files={files}
                            mode={mode}
                            onRemoveFile={removeFile}
                            onAnalyzeFile={analyzeFile}
                            onCreateEntry={createEntry}
                            onUpdateResult={handleUpdateResult}
                            onAddMore={() => fileInputRef.current?.click()}
                            onCreateAll={createAll}
                        />
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    )
}
