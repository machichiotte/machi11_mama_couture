import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateCollectionFromText, generateImage } from '@/lib/ai/gemini'

export const POST = async (req: NextRequest) => {
    try {
        const payload = await getPayload({ config })
        const { collectionName } = await req.json()

        if (!collectionName || typeof collectionName !== 'string') {
            return NextResponse.json(
                { error: 'Collection name is required' },
                { status: 400 }
            )
        }


        console.log('🚀 [AI-GEN] Démarrage génération pour:', collectionName)

        // 0. Récupérer les collections existantes pour contexte
        const existingSeriesDocs = await payload.find({
            collection: 'series',
            limit: 20,
            sort: '-createdAt',
        })
        const existingTitles = existingSeriesDocs.docs.map(doc => doc.title).filter(t => typeof t === 'string') as string[]

        // 1. Générer les métadonnées
        console.log('🤖 [AI-GEN] Appel Gemini avec contexte:', existingTitles.length, 'collections')
        const metadata = await generateCollectionFromText(collectionName, existingTitles)
        console.log('✅ [AI-GEN] Métadonnées reçues:', JSON.stringify(metadata.titleOptions))

        // 2. Générer l'image via Gemini (avec fallback)
        console.log('🎨 [AI-GEN] Génération image...')

        let imageBuffer: Buffer
        try {
            // Utilisation directe de l'API Gemini 2.0 Flash
            imageBuffer = await generateImage(metadata.imagePrompt)
            console.log('✅ [AI-GEN] Image buffer récupéré via Gemini')
        } catch (imageError) {
            console.error('⚠️ [AI-GEN] Échec génération image:', imageError)
            console.log('⚠️ [AI-GEN] Utilisation image fallback (gris)')
            // A valid 1x1 gray pixel JPEG
            const FALLBACK_IMAGE = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
            imageBuffer = Buffer.from(FALLBACK_IMAGE, 'base64')
        }

        // 3. Upload Media
        console.log('📤 [AI-GEN] Création média dans Payload...')
        const mediaDoc = await payload.create({
            collection: 'media',
            data: {
                alt: metadata.titleOptions.object || collectionName,
            },
            file: {
                data: imageBuffer,
                name: `ai-gen-${collectionName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`,
                mimetype: 'image/jpeg',
                size: imageBuffer.length,
            },
        })
        console.log('✅ [AI-GEN] Media créé ID:', mediaDoc.id)

        // 4. Création de la Série
        console.log('🏗️ [AI-GEN] Création de la collection (Series)...')
        const seriesDoc = await payload.create({
            collection: 'series',
            data: {
                title: metadata.titleOptions.theme || collectionName,
                description: metadata.descriptionOptions.theme || '',
                coverImage: mediaDoc.id,
                isPublished: false,
            },
        })
        console.log('✅ [AI-GEN] SUCCESS ! Collection créée ID:', seriesDoc.id)

        return NextResponse.json({
            success: true,
            series: seriesDoc,
            metadata: metadata,
            message: `Collection "${seriesDoc.title}" créée avec succès.`
        })
    } catch (error) {
        console.error('Generate Collection API Error:', error)
        return NextResponse.json(
            {
                error: 'Generation and Creation failed',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}
