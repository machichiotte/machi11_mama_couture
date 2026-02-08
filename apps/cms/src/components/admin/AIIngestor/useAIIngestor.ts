import { useState, useRef } from 'react'
import { toast } from '@payloadcms/ui'
import { AIResult, IngestorFile } from './types'

export const useAIIngestor = () => {
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
        if (!fileData) return

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
                const defaultType = 'object'
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
        if (!fileData || !fileData.result || !fileData.file) return

        try {
            const formData = new FormData()
            formData.append('file', fileData.file)
            formData.append('title', fileData.result.title)
            formData.append('description', fileData.result.description)
            if (fileData.result.price) formData.append('price', String(fileData.result.price))
            if (fileData.result.details) formData.append('details', fileData.result.details)
            if (fileData.result.seriesMatch) formData.append('seriesMatch', fileData.result.seriesMatch)
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
        // Run in reverse to avoid index shifting issues if we remove items one by one
        // Use a loop to be able to await each creation sequentially or use Promise.all if they can be parallel
        // For CMS stability, sequential might be safer and show progress better via toasts
        const completeIndices = files
            .map((f, i) => f.status === 'complete' ? i : -1)
            .filter(i => i !== -1)
            .reverse()

        for (const index of completeIndices) {
            await createEntry(index)
        }
    }

    const handleUpdateResult = (index: number, newResult: AIResult) => {
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, result: newResult } : f))
    }

    const handleStartAnalysis = (userTitle?: string, userDescription?: string) => {
        setStep(3)
        // Need to use the latest files from state inside the effect/callback
        // Actually, since we're initiating analysis on all files just imported
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

    return {
        step,
        setStep,
        mode,
        setMode,
        files,
        fileInputRef,
        onDrop,
        handleFileChange,
        removeFile,
        analyzeFile,
        analyzeAll,
        createEntry,
        createAll,
        handleUpdateResult,
        handleStartAnalysis,
        reset,
        handleBack
    }
}
