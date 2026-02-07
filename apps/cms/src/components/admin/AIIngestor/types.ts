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
    error?: string
}

export interface IngestorFile {
    file: File
    status: 'pending' | 'analyzing' | 'complete' | 'error'
    result?: AIResult
}
