import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { analyzeSeriesImage, analyzeCreationImages } from '@/lib/ai/gemini'

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData()
        const files = formData.getAll('file') as File[]
        const mode = formData.get('mode') as 'series' | 'creation'
        const userTitle = formData.get('userTitle') as string | null
        const userDescription = formData.get('userDescription') as string | null

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const buffers = await Promise.all(
            files.map(async (file) => Buffer.from(await file.arrayBuffer()))
        )
        const mimeType = files[0].type || 'image/jpeg'

        const payload = await getPayload({ config })

        let result
        if (mode === 'creation') {
            const seriesDocs = await payload.find({ collection: 'series', depth: 0, limit: 100 })
            const seriesNames = seriesDocs.docs.map((s: any) => s.title)
            result = await analyzeCreationImages(buffers, seriesNames, mimeType)
        } else {
            result = await analyzeSeriesImage(buffers[0], mimeType, userTitle, userDescription)
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
