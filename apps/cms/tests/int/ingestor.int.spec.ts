import { describe, it, expect, beforeAll, vi } from 'vitest'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { POST as generateCollectionPost } from '@/app/(payload)/admin/api/generate-collection/route'
import { NextRequest } from 'next/server'

describe('AI Ingestor Backend', () => {
    let payload: any
    let testMediaId: string | number

    beforeAll(async () => {
        const payloadConfig = await config
        payload = await getPayload({ config: payloadConfig })

        // Use a real valid image buffer (PNG 1x1 red dot)
        const RED_DOT = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

        try {
            // Ensure we have at least one media for "coverImage" requirements
            const media = await payload.create({
                collection: 'media',
                data: { alt: 'Test Media' },
                file: {
                    data: RED_DOT,
                    name: `test-media-${Date.now()}.png`,
                    mimetype: 'image/png',
                    size: RED_DOT.length,
                }
            })
            testMediaId = media.id
        } catch (e) {
            console.error('Error creating base media:', e)
        }
    })

    const createMockRequest = (formData: FormData): NextRequest => {
        return {
            headers: {
                get: (name: string) => name.toLowerCase() === 'content-type' ? 'multipart/form-data' : null
            },
            formData: async () => formData,
            json: async () => ({}),
            // Add other necessary fields if needed
        } as unknown as NextRequest
    }

    it('creates a new Series (Collection) via the ingestor route', async () => {
        const formData = new FormData()
        formData.append('mode', 'series')
        formData.append('title', 'Test Collection Ingestor ' + Date.now())
        formData.append('description', 'Test Description')

        const RED_DOT = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
        const file = new File([RED_DOT], 'test_ingest.png', { type: 'image/png' })

        formData.append('file', file)

        const req = createMockRequest(formData)
        const response = await generateCollectionPost(req)
        const data = await response.json()

        if (response.status !== 200) {
            console.error('Series creation failed. Data:', data)
        }

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
    })

    it('creates a new Creation linked to a series', async () => {
        const series = await payload.find({
            collection: 'series',
            limit: 1
        })

        if (series.docs.length === 0) {
            throw new Error('No series found for creation test')
        }

        const seriesTitle = series.docs[0].title

        const formData = new FormData()
        formData.append('mode', 'creation')
        formData.append('title', 'Test Creation Ingestor ' + Date.now())
        formData.append('description', 'Test Creation Description')
        formData.append('price', '45')
        formData.append('details', 'Test Details')
        formData.append('seriesMatch', seriesTitle)

        const RED_DOT = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
        const file = new File([RED_DOT], 'creation.png', { type: 'image/png' })
        formData.append('file', file)

        const req = createMockRequest(formData)
        const response = await generateCollectionPost(req)
        const data = await response.json()

        if (response.status !== 200) console.error('Creation creation failed:', data)

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
    })

    it('handles multiple files for a creation', async () => {
        const series = await payload.find({
            collection: 'series',
            limit: 1
        })

        const seriesTitle = series.docs[0].title

        const formData = new FormData()
        formData.append('mode', 'creation')
        formData.append('title', 'Multi-file Creation ' + Date.now())
        formData.append('seriesMatch', seriesTitle)

        const RED_DOT = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
        formData.append('file', new File([RED_DOT], '1.png', { type: 'image/png' }))
        formData.append('file', new File([RED_DOT], '2.png', { type: 'image/png' }))

        const req = createMockRequest(formData)
        const response = await generateCollectionPost(req)
        const data = await response.json()

        if (response.status !== 200) console.error('Multi-file creation failed:', data)

        expect(response.status).toBe(200)

        const creation = await (payload as any).findByID({
            collection: 'creations',
            id: data.doc.id
        })

        expect(creation.images.length).toBe(2)
    })
})
