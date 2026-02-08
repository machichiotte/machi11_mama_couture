export type AIResult = {
    title: string
    description: string
    titleOptions?: {
        object: string
        theme: string
        creative: string
    }
    descriptionOptions?: {
        object: string
        theme: string
        creative: string
    }
    price?: number
    details?: string
    alt?: string
    seriesMatch?: string
    error?: string
}

export interface IngestorFile {
    file: File
    status: 'pending' | 'analyzing' | 'complete' | 'error'
    result?: AIResult
}
