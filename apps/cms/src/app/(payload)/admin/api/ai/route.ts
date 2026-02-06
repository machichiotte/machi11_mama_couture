import { NextRequest, NextResponse } from 'next/server'
import { analyzeSeriesImage } from '@/lib/ai/gemini'

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const mimeType = file.type || 'image/jpeg'

        const result = await analyzeSeriesImage(buffer, mimeType)

        return NextResponse.json(result)
    } catch (error) {
        console.error('AI API Error:', error)
        return NextResponse.json(
            { error: 'AI Processing Failed', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
