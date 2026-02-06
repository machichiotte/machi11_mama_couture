import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const GET = async (req: NextRequest) => {
    try {
        const payload = await getPayload({ config })
        const series = await payload.find({
            collection: 'series',
            depth: 0,
            limit: 100,
        })

        return NextResponse.json(series.docs.map(s => ({ id: s.id, title: s.title })))
    } catch (error) {
        console.error('Series API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 })
    }
}
