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

        if (!file || !title) {
            return NextResponse.json({ error: 'Missing file or title' }, { status: 400 })
        }

        // 1. Upload de l'image via l'API locale de Payload (Media collection)
        // Note: On utilise create({ collection: 'media' }) directement pour let Payload gérer le stockage (R2/Cloudinary)
        const buffer = Buffer.from(await file.arrayBuffer())

        // On doit recréer un objet compatible pour l'upload Payload si on n'utilise pas l'API REST standard
        // Mais ici on est server-side, on peut utiliser payload.create directement avec un buffer

        const mediaDoc = await payload.create({
            collection: 'media',
            data: {
                alt: title, // Alt par défaut = titre de la collection
            },
            file: {
                data: buffer,
                name: file.name,
                mimetype: file.type,
                size: file.size,
            },
        })

        // 2. Création de la collection (Series)
        const seriesDoc = await payload.create({
            collection: 'series',
            data: {
                title,
                description,
                coverImage: mediaDoc.id,
                isPublished: false, // Brouillon par sécurité
                publishDate: new Date().toISOString(),
            },
        })

        return NextResponse.json({
            success: true,
            series: seriesDoc,
            url: `/admin/collections/series/${seriesDoc.id}`
        })

    } catch (error) {
        console.error('Create Collection API Error:', error)
        return NextResponse.json(
            { error: 'Creation Failed', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
