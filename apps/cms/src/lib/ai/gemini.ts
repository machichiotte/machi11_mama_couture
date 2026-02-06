import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '../utils/logger'

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

/**
 * Prompt de base pour l'IA, orienté artisanat et couture.
 */
const SYSTEM_PROMPT_BASE = `Tu es un assistant spécialisé dans la gestion d'une boutique d'artisanat de couture nommée "Atelier Petit Point". 
Ta mission est d'aider l'artisane (Mama Couture) à décrire ses créations de manière élégante, poétique et professionnelle.
Toute tes réponses doivent être en Français.`

/**
 * Analyse une image pour suggérer une nouvelle série/collection.
 */
export async function analyzeSeriesImage(imageBuffer: Buffer, mimeType: string = 'image/jpeg') {
    if (!GEMINI_API_KEY) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const base64Data = imageBuffer.toString('base64')

    const prompt = `Analyse cette image d'ambiance ou de matières. 
    1. Suggère un titre de collection (court, élégant).
    2. Rédige une description poétique (2-3 phrases) qui évoque l'histoire de cette future collection.
    Réponds uniquement au format JSON : { "title": "...", "description": "..." }`

    const result = await model.generateContent([
        { text: SYSTEM_PROMPT_BASE },
        { text: prompt },
        { inlineData: { data: base64Data, mimeType } }
    ])

    const response = await result.response
    const text = response.text()
    return parseAIResponse(text)
}

/**
 * Analyse une ou plusieurs images pour créer des créations.
 */
export async function analyzeCreationImages(
    imageBuffers: Buffer[],
    existingSeries: string[],
    mimeType: string = 'image/jpeg'
) {
    if (!GEMINI_API_KEY) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Voici une ou plusieurs photos d'une même création de couture.
    Analyse les détails, les textures et les formes.
    1. Suggère un titre (ex: "Le Sac Cabas en Lin").
    2. Rédige une description détaillant le soin apporté.
    3. Suggère un prix en Euros (nombre uniquement) basé sur la complexité apparente.
    4. Propose un texte alternatif (Alt) pour l'accessibilité SEO.
    5. Identifie à laquelle de ces collections existantes elle appartient le mieux : ${existingSeries.join(', ')} (si aucune ne correspond, propose "Autre").
    
    Réponds uniquement au format JSON : { "title": "...", "description": "...", "price": 0, "alt": "...", "seriesMatch": "..." }`

    // Pour simplifier on prend la première image du pack pour l'analyse principale
    const base64Data = imageBuffers[0].toString('base64')

    const result = await model.generateContent([
        { text: SYSTEM_PROMPT_BASE },
        { text: prompt },
        { inlineData: { data: base64Data, mimeType } }
    ])

    const response = await result.response
    const text = response.text()
    return parseAIResponse(text)
}

function parseAIResponse(text: string) {
    try {
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()
        return JSON.parse(jsonStr)
    } catch (error) {
        logger.error('Failed to parse Gemini response', text)
        throw new Error('AI Response parsing failed')
    }
}
