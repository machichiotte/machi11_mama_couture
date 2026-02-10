import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateCollectionFromText, generateImage } from '@/lib/ai/gemini'

export const GET = async (req: NextRequest) => {
    try {
        const payload = await getPayload({ config })
        const series = await payload.find({
            collection: 'series',
            limit: 100,
            sort: 'title'
        })
        return NextResponse.json(series.docs)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 })
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const payload = await getPayload({ config })

        // Extraction des données
        let mode: 'series' | 'creation' = 'series'
        let title: string = ''
        let description: string = ''
        let files: File[] = []
        let price: number | undefined
        let details: string | undefined
        let seriesMatch: string | undefined

        const contentType = req.headers.get('content-type') || ''

        if (contentType.includes('multipart/form-data') || !contentType) {
            try {
                const formData = await req.formData()
                mode = (formData.get('mode') as 'series' | 'creation') || 'series'
                title = formData.get('title') as string || formData.get('collectionName') as string || ''
                description = formData.get('description') as string || ''
                files = formData.getAll('file') as File[]
                price = formData.get('price') ? Number(formData.get('price')) : undefined
                details = formData.get('details') as string || undefined
                seriesMatch = formData.get('seriesMatch') as string || undefined
            } catch (formError) {
                if (contentType.includes('application/json') || !contentType) {
                    try {
                        const body = await req.json()
                        title = body.title || body.collectionName || ''
                        description = body.description || ''
                        mode = body.mode || 'series'
                    } catch (jsonErr) { }
                }
            }
        } else {
            const body = await req.json()
            title = body.title || body.collectionName || ''
            description = body.description || ''
            mode = body.mode || 'series'
        }

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }

        let mediaIds: (string | number)[] = []

        // CAS 1 : On a des fichiers (Ingestor)
        if (files.length > 0) {
            for (const [index, file] of files.entries()) {
                const arrayBuffer = typeof file.arrayBuffer === 'function'
                    ? await file.arrayBuffer()
                    : await (new Response(file).arrayBuffer())

                const buffer = Buffer.from(arrayBuffer)
                const fileName = `ai-ingest-${Date.now()}-${index}-${file.name.toLowerCase().replace(/\s+/g, '-')}`
                const mimeType = file.type || 'image/jpeg'

                const mediaDoc = await payload.create({
                    collection: 'media',
                    data: { alt: title },
                    file: {
                        data: buffer,
                        name: fileName,
                        mimetype: mimeType,
                        size: buffer.length,
                    },
                    overrideAccess: true,
                })
                mediaIds.push(mediaDoc.id)
            }
        }
        // CAS 2 : Pas de fichier -> Auto-génération
        else {
            const existingSeriesDocs = await payload.find({
                collection: 'series',
                limit: 20,
                sort: '-createdAt',
                overrideAccess: true,
            })
            const existingTitles = existingSeriesDocs.docs.map(doc => doc.title).filter(t => typeof t === 'string') as string[]

            const metadata = await generateCollectionFromText(title, existingTitles)
            title = metadata.titleOptions.theme || title
            description = metadata.descriptionOptions.theme || description

            let imageBuffer: Buffer
            try {
                imageBuffer = await generateImage(metadata.imagePrompt)
            } catch (imageError) {
                const FALLBACK_IMAGE = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAABAQABPxA="
                imageBuffer = Buffer.from(FALLBACK_IMAGE, 'base64')
            }

            const mediaDoc = await payload.create({
                collection: 'media',
                data: { alt: title },
                file: {
                    data: imageBuffer,
                    name: `ai-gen-${Date.now()}.jpg`,
                    mimetype: 'image/jpeg',
                    size: imageBuffer.length,
                },
                overrideAccess: true,
            })
            mediaIds = [mediaDoc.id]
        }

        if (mode === 'creation') {
            let seriesId: string | number | undefined
            if (seriesMatch) {
                const matchedSeries = await payload.find({
                    collection: 'series',
                    where: { title: { equals: seriesMatch } },
                    limit: 1,
                    overrideAccess: true,
                })
                if (matchedSeries.docs.length > 0) {
                    seriesId = matchedSeries.docs[0].id
                }
            }

            const creationDoc = await payload.create({
                collection: 'creations',
                data: {
                    title,
                    description: {
                        root: {
                            type: 'root',
                            children: [{
                                type: 'paragraph',
                                children: [{ text: description, type: 'text', detail: 0, format: 0, mode: 'normal', style: '' }],
                                direction: 'ltr',
                                format: '',
                                indent: 0,
                                version: 1
                            }],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            version: 1
                        }
                    },
                    details: details || '',
                    images: mediaIds.map(id => ({ image: id })),
                    series: seriesId as any,
                    price: price || 0,
                    stockStatus: 'hidden',
                    isPublished: false,
                } as any,
                overrideAccess: true,
            })
            return NextResponse.json({ success: true, doc: creationDoc })
        } else {
            const seriesDoc = await payload.create({
                collection: 'series',
                data: {
                    title,
                    description,
                    coverImage: (mediaIds[0] as any) || '',
                    isPublished: false,
                },
                overrideAccess: true,
            })
            return NextResponse.json({ success: true, doc: seriesDoc })
        }

    } catch (error) {
        console.error('Create Entry API Error:', error)
        return NextResponse.json(
            { error: 'Creation failed', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
