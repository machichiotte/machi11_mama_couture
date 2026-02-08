import React from 'react'
import { Plus } from 'lucide-react'
import { FileItem } from './FileItem'
import { IngestorFile, AIResult } from './types'

interface Step3ValidationProps {
    files: IngestorFile[]
    mode: 'series' | 'creation'
    onRemoveFile: (index: number) => void
    onAnalyzeFile: (index: number, title?: string, desc?: string) => void
    onCreateEntry: (index: number) => void
    onUpdateResult: (index: number, result: AIResult) => void
    onAddMore: () => void
}

export const Step3Validation: React.FC<Step3ValidationProps> = ({
    files,
    mode,
    onRemoveFile,
    onAnalyzeFile,
    onCreateEntry,
    onUpdateResult,
    onAddMore
}) => {
    if (files.length === 0) return null

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
            <ul className="grid grid-cols-1 gap-16">
                {files.map((fileData, index) => (
                    <FileItem
                        key={index}
                        file={fileData.file}
                        index={index}
                        result={fileData.result}
                        isAnalyzing={fileData.status === 'analyzing'}
                        onRemove={onRemoveFile}
                        onCreate={onCreateEntry}
                        onAnalyze={onAnalyzeFile}
                        mode={mode}
                        onUpdateResult={onUpdateResult}
                    />
                ))}
            </ul>
        </div>
    )
}
