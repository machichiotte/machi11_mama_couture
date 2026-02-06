import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { analyzeSeriesImage, analyzeCreationImages } from '@/lib/ai/gemini'

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const mode = formData.get('mode') as 'series' | 'creation'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const mimeType = file.type || 'image/jpeg'

        const payload = await getPayload({ config })

        let result
        if (mode === 'creation') {
            const seriesDocs = await payload.find({ collection: 'series', depth: 0, limit: 100 })
            const seriesNames = seriesDocs.docs.map((s: any) => s.title)
            result = await analyzeCreationImages([buffer], seriesNames, mimeType)
        } else {
            result = await analyzeSeriesImage(buffer, mimeType)
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('AI API Error:', error)
        return NextResponse.json(
            { error: 'AI Processing Failed', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
