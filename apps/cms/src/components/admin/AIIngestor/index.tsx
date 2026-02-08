'use client'

import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Stepper } from './Stepper'
import { IngestorActions } from './IngestorActions'
import { Step1Mode } from './Step1Mode'
import { Step2Import } from './Step2Import'
import { Step3Validation } from './Step3Validation'
import { useAIIngestor } from './useAIIngestor'

export const AIIngestor: React.FC = () => {
    const {
        step,
        setStep,
        mode,
        setMode,
        files,
        series,
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
        handleBack,
        mergeFiles,
        addFilesToItem,
        updateItemFields
    } = useAIIngestor()

    const STEPS = [
        { label: 'MODE', description: step === 1 ? 'COLLECTION OU CRÉATIONS' : (mode === 'series' ? 'COLLECTION' : 'CRÉATIONS') },
        { label: 'IMPORT', description: 'IMAGE(S)' },
        { label: 'VALIDATION', description: 'VÉRIFICATION ET CRÉATION' }
    ]

    return (
        <div className="ai-container">
            <div className="max-w-[1600px] mx-auto space-y-16">
                {/* Header Section */}
                <div className="space-y-8 text-center">
                    <h1 className="ai-title">
                        Atelier <span className="text-brand-accent">Petit Point</span>
                    </h1>
                    <div className="flex justify-center">
                        <p className="text-white/60 text-base md:text-lg font-medium max-w-3xl leading-relaxed italic text-center">
                            Votre assistant créatif pour transformer vos photos en collections et créations prêtes à publier.
                        </p>
                    </div>
                </div>

                <Stepper
                    currentStep={step}
                    steps={STEPS}
                    onBack={step > 1 ? handleBack : undefined}
                    action={step === 3 && (
                        files.filter(f => f.status === 'analyzing').length > 0 ? (
                            <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-full border border-white/5 animate-pulse">
                                <div className="w-5 h-5 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                                    {files.filter(f => f.status === 'analyzing').length} Analyse{files.filter(f => f.status === 'analyzing').length > 1 ? 's' : ''} en cours
                                </span>
                            </div>
                        ) : (
                            files.filter(f => f.status === 'done').length > 0 && (
                                <button
                                    onClick={createAll}
                                    className="ai-button-primary px-8 whitespace-nowrap"
                                >
                                    <CheckCircle2 size={16} />
                                    {mode === 'series'
                                        ? `AJOUTER ${files.filter(f => f.status === 'done').length} COLLECTION${files.filter(f => f.status === 'done').length > 1 ? 'S' : ''}`
                                        : `AJOUTER ${files.filter(f => f.status === 'done').length} CRÉATION${files.filter(f => f.status === 'done').length > 1 ? 'S' : ''}`
                                    }
                                </button>
                            )
                        )
                    )}
                    showActionConnection={step === 3 && files.filter(f => f.status === 'done').length > 0 && files.filter(f => f.status === 'analyzing').length === 0}
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
                        series={series}
                        onRemoveFile={removeFile}
                        onMergeFiles={mergeFiles}
                        onAddFilesToItem={addFilesToItem}
                        onUpdateItemFields={updateItemFields}
                        onStartAnalysis={handleStartAnalysis}
                    />
                )}

                {step === 3 && (
                    <div className="space-y-4 pt-10">
                        <Step3Validation
                            files={files}
                            mode={mode}
                            series={series}
                            onRemoveFile={removeFile}
                            onAnalyzeFile={analyzeFile}
                            onCreateEntry={createEntry}
                            onUpdateResult={handleUpdateResult}
                            onUpdateItemFields={updateItemFields}
                            onAddMore={() => fileInputRef.current?.click()}
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
