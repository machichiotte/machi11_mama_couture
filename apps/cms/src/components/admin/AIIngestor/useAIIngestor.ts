import { useState, useRef, useEffect } from 'react'
import { toast } from '@payloadcms/ui'
import { AIResult, IngestorFile } from './types'

export const useAIIngestor = () => {
    const [step, setStep] = useState<number>(1)
    const [mode, setMode] = useState<'series' | 'creation'>('creation')
    const [files, setFiles] = useState<IngestorFile[]>([])
    const [series, setSeries] = useState<{ id: string | number, title: string }[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const res = await fetch('/admin/api/generate-collection')
                const data = await res.json()
                setSeries(data)
            } catch (e) {
                console.error('Failed to fetch series:', e)
            }
        }
        fetchSeries()
    }, [])

    const onDrop = (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            files: [file],
            status: 'pending' as const
        }))
        setFiles(prev => [...prev, ...newFiles])
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onDrop(Array.from(e.target.files))
        }
    }

    const removeFile = (id: string) => {
        setFiles(prev => {
            const newFiles = prev.filter(f => f.id !== id)
            if (newFiles.length === 0 && step === 3) {
                setStep(2)
            }
            return newFiles
        })
    }

    const mergeFiles = (sourceId: string, targetId: string) => {
        if (sourceId === targetId) return
        setFiles(prev => {
            const source = prev.find(f => f.id === sourceId)
            const target = prev.find(f => f.id === targetId)
            if (!source || !target) return prev

            return prev.filter(f => f.id !== sourceId).map(f => {
                if (f.id === targetId) {
                    return {
                        ...f,
                        files: [...f.files, ...source.files],
                        status: 'pending' // Reset status if we add images
                    }
                }
                return f
            })
        })
    }

    const addFilesToItem = (id: string, newFiles: File[]) => {
        setFiles(prev => prev.map(f => {
            if (f.id === id) {
                return {
                    ...f,
                    files: [...f.files, ...newFiles],
                    status: 'pending'
                }
            }
            return f
        }))
    }

    const updateItemFields = (id: string, fields: Partial<Pick<IngestorFile, 'userTitle' | 'userDescription' | 'userSeries'>>) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, ...fields } : f))
    }

    const analyzeFile = async (id: string, userTitle?: string, userDescription?: string) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'analyzing' } : f))

        const fileData = files.find(f => f.id === id)
        if (!fileData || fileData.files.length === 0) return

        const formData = new FormData()
        // Envoi de TOUS les fichiers du groupe
        fileData.files.forEach(file => {
            formData.append('file', file) // Note: backend only takes one for now but we'll adapt
        })
        formData.append('mode', mode)

        if (userTitle) formData.append('userTitle', userTitle)
        if (userDescription) formData.append('userDescription', userDescription)

        try {
            const res = await fetch('/admin/api/ai', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                throw new Error(`Erreur serveur: ${res.status}`)
            }

            const data = await res.json()

            let defaultTitle = data.title
            let defaultDescription = data.description

            if (data.titleOptions && data.descriptionOptions) {
                const defaultType = 'object'
                defaultTitle = data.titleOptions[defaultType]
                defaultDescription = data.descriptionOptions[defaultType]
            }

            setFiles(prev => prev.map(f => f.id === id ? {
                ...f,
                status: 'done',
                result: {
                    ...data,
                    title: defaultTitle,
                    description: defaultDescription
                }
            } : f))
        } catch (e) {
            setFiles(prev => prev.map(f => f.id === id ? {
                ...f,
                status: 'error',
                result: { title: '', description: '', error: 'Erreur analyse IA' }
            } : f))
        }
    }

    const analyzeAll = () => {
        files.forEach((file) => {
            if (file.status === 'pending') {
                analyzeFile(file.id)
            }
        })
    }

    const createEntry = async (id: string) => {
        const fileData = files.find(f => f.id === id)
        if (!fileData || !fileData.result || fileData.files.length === 0) return

        try {
            const formData = new FormData()
            // On envoie toutes les images pour la création
            fileData.files.forEach(file => {
                formData.append('file', file)
            })
            formData.append('title', fileData.userTitle || fileData.result.title)
            formData.append('description', fileData.userDescription || fileData.result.description)
            if (fileData.result.price) formData.append('price', String(fileData.result.price))
            if (fileData.result.details) formData.append('details', fileData.result.details)

            const seriesToUse = fileData.userSeries || fileData.result.seriesMatch
            if (seriesToUse) formData.append('seriesMatch', seriesToUse)

            formData.append('mode', mode)

            const res = await fetch('/admin/api/generate-collection', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error('Failed to create')

            toast.success(`${mode === 'series' ? 'Série' : 'Création'} créée avec succès !`)
            removeFile(id)
        } catch (e) {
            toast.error(`Erreur lors de la création : ${e instanceof Error ? e.message : 'Erreur inconnue'}`)
        }
    }

    const createAll = async () => {
        const doneIndices = files
            .filter(f => f.status === 'done')
            .map(f => f.id)
            .reverse()

        for (const id of doneIndices) {
            await createEntry(id)
        }
    }

    const handleUpdateResult = (id: string, newResult: AIResult) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, result: newResult } : f))
    }

    const handleStartAnalysis = (userTitle?: string, userDescription?: string) => {
        setStep(3)
        files.forEach((file) => {
            if (file.status === 'pending') {
                analyzeFile(file.id, userTitle, userDescription)
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
        handleBack,
        mergeFiles,
        addFilesToItem,
        updateItemFields,
        series
    }
}
