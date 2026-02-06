import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const POST = async (req: NextRequest) => {
    try {
        const payload = await getPayload({ config })
        const formData = await req.formData()

        // Extraction des données
        const file = formData.get('file') as File
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const price = formData.get('price') as string
        const alt = formData.get('alt') as string
        const seriesName = formData.get('seriesMatch') as string

        if (!file || !title) {
            return NextResponse.json({ error: 'Missing file or title' }, { status: 400 })
        }

        // 1. Trouver l'ID de la collection correspondante
        let seriesId: any = undefined
        if (seriesName && seriesName !== 'Autre') {
            const matchingSeries = await payload.find({
                collection: 'series',
                where: {
                    title: { equals: seriesName }
                },
                limit: 1
            })
            if (matchingSeries.docs.length > 0) {
                seriesId = matchingSeries.docs[0].id
            }
        }

        // 2. Upload de l'image
        const buffer = Buffer.from(await file.arrayBuffer())
        const mediaDoc = await payload.create({
            collection: 'media',
            data: {
                alt: alt || title,
            },
            file: {
                data: buffer,
                name: file.name,
                mimetype: file.type,
                size: file.size,
            },
        })

        // 3. Création de la Création
        const creationDoc = await payload.create({
            collection: 'creations',
            data: {
                title,
                description: {
                    root: {
                        type: 'root',
                        format: '',
                        indent: 0,
                        version: 1,
                        children: [
                            {
                                type: 'paragraph',
                                format: '',
                                indent: 0,
                                version: 1,
                                children: [
                                    {
                                        detail: 0,
                                        format: 0,
                                        mode: 'normal',
                                        style: '',
                                        text: description,
                                        type: 'text',
                                        version: 1
                                    }
                                ]
                            }
                        ]
                    }
                } as any,
                price: price ? Number(price) : 0,
                series: seriesId,
                images: [{ image: mediaDoc.id }],
                isPublished: false,
                stockStatus: 'in-stock',
            },
        })

        return NextResponse.json({
            success: true,
            creation: creationDoc,
            url: `/admin/collections/creations/${creationDoc.id}`
        })

    } catch (error) {
        console.error('Create Creation API Error:', error)
        return NextResponse.json(
            { error: 'Creation Failed', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
