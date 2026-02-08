import React from 'react'
import { Plus } from 'lucide-react'
import { FileItem } from './FileItem'
import { IngestorFile, AIResult } from './types'

interface Step3ValidationProps {
    files: IngestorFile[]
    mode: 'series' | 'creation'
    series: { id: string | number, title: string }[]
    onRemoveFile: (id: string) => void
    onAnalyzeFile: (id: string, title?: string, desc?: string) => void
    onCreateEntry: (id: string) => void
    onUpdateResult: (id: string, result: AIResult) => void
    onUpdateItemFields: (id: string, fields: Partial<Pick<IngestorFile, 'userTitle' | 'userDescription' | 'userSeries'>>) => void
    onAddMore: () => void
}

export const Step3Validation: React.FC<Step3ValidationProps> = ({
    files,
    mode,
    series,
    onRemoveFile,
    onAnalyzeFile,
    onCreateEntry,
    onUpdateResult,
    onUpdateItemFields,
    onAddMore
}) => {
    if (files.length === 0) return null

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 pb-20">
            <ul className="grid grid-cols-1 2xl:grid-cols-2 gap-12">
                {files.map((fileData, index) => (
                    <FileItem
                        key={fileData.id}
                        id={fileData.id}
                        index={index}
                        files={fileData.files}
                        result={fileData.result}
                        userTitle={fileData.userTitle}
                        userDescription={fileData.userDescription}
                        userSeries={fileData.userSeries}
                        isAnalyzing={fileData.status === 'analyzing'}
                        onRemove={onRemoveFile}
                        onCreate={onCreateEntry}
                        onAnalyze={onAnalyzeFile}
                        mode={mode}
                        onUpdateResult={onUpdateResult}
                        onUpdateFields={onUpdateItemFields}
                        series={series}
                    />
                ))}
            </ul>
        </div>
    )
}
