import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateCollectionFromText, generateImage } from '@/lib/ai/gemini'

export const POST = async (req: NextRequest) => {
    try {
        const payload = await getPayload({ config })

        // On essaie de récupérer les données soit via FormData (Ingestor) soit via JSON (Ancien flux/Text Gen)
        let mode: 'series' | 'creation' = 'series'
        let title: string = ''
        let description: string = ''
        let file: File | null = null
        let price: number | undefined
        let details: string | undefined
        let seriesMatch: string | undefined

        const contentType = req.headers.get('content-type') || ''

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            mode = (formData.get('mode') as 'series' | 'creation') || 'series'
            title = formData.get('title') as string || formData.get('collectionName') as string || ''
            description = formData.get('description') as string || ''
            file = formData.get('file') as File | null
            price = formData.get('price') ? Number(formData.get('price')) : undefined
            details = formData.get('details') as string || undefined
            seriesMatch = formData.get('seriesMatch') as string || undefined
        } else {
            const body = await req.json()
            title = body.title || body.collectionName || ''
            description = body.description || ''
            mode = body.mode || 'series'
        }

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }

        console.log(`🚀 [AI-CREATE] Mode: ${mode} | Title: ${title}`)

        let mediaId: string | number

        // CAS 1 : On a un fichier (Ingestor)
        if (file) {
            console.log('📤 [AI-CREATE] Uploading provided file...')
            const buffer = Buffer.from(await file.arrayBuffer())
            const mediaDoc = await payload.create({
                collection: 'media',
                data: { alt: title },
                file: {
                    data: buffer,
                    name: `ai-ingest-${Date.now()}-${file.name.toLowerCase().replace(/\s+/g, '-')}`,
                    mimetype: file.type || 'image/jpeg',
                    size: buffer.length,
                },
            })
            mediaId = mediaDoc.id
        }
        // CAS 2 : Pas de fichier -> On fait l'auto-génération (Text to Collection)
        else {
            console.log('🤖 [AI-CREATE] No file provided, starting auto-generation...')
            const existingSeriesDocs = await payload.find({
                collection: 'series',
                limit: 20,
                sort: '-createdAt',
            })
            const existingTitles = existingSeriesDocs.docs.map(doc => doc.title).filter(t => typeof t === 'string') as string[]

            const metadata = await generateCollectionFromText(title, existingTitles)
            title = metadata.titleOptions.theme || title
            description = metadata.descriptionOptions.theme || description

            let imageBuffer: Buffer
            try {
                imageBuffer = await generateImage(metadata.imagePrompt)
            } catch (imageError) {
                const FALLBACK_IMAGE = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
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
            })
            mediaId = mediaDoc.id
        }

        // Création de l'entrée finale
        if (mode === 'creation') {
            console.log('🏗️ [AI-CREATE] Creating Creation entry...')

            // Trouver la série correspondante si seriesMatch est fourni
            let seriesId: string | number | undefined
            if (seriesMatch) {
                const matchedSeries = await payload.find({
                    collection: 'series',
                    where: { title: { equals: seriesMatch } },
                    limit: 1
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
                    images: [{ image: mediaId }],
                    series: seriesId as any, // Payload relation ID
                    price: price || 0,
                    stockStatus: 'hidden',
                    isPublished: false,
                } as any
            })
            return NextResponse.json({ success: true, doc: creationDoc })
        } else {
            console.log('🏗️ [AI-CREATE] Creating Series entry...')
            const seriesDoc = await payload.create({
                collection: 'series',
                data: {
                    title,
                    description,
                    coverImage: mediaId,
                    isPublished: false,
                },
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
