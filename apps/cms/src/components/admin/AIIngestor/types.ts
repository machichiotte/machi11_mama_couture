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
    id: string
    files: File[]
    status: 'pending' | 'analyzing' | 'done' | 'error'
    result?: AIResult
    userTitle?: string
    userDescription?: string
    userSeries?: string
}
