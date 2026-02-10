import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '../utils/logger'

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

/**
 * Prompt de base pour l'IA, orienté artisanat et couture.
 */
const SYSTEM_PROMPT_BASE = `Tu es un assistant spécialisé dans la gestion d'une boutique d'artisanat de couture nommée "Atelier Petit Point". 
Ta mission est d'aider l'artisane (Mama Couture) à décrire ses créations.
IMPORTANT : Les images fournies sont des illustrations de style "catalogue vintage européen" (gravure, aquarelle, Art Nouveau).
Tu ne dois pas décrire le style graphique (ne dis pas "c'est un dessin"), mais décrire l'objet représenté comme s'il était réel (ex: "Un porte-monnaie" et non "Un dessin de porte-monnaie").
Toutes tes réponses doivent être en Français.`

/**
 * Analyse une image pour suggérer une nouvelle série/collection.
 * Accepte des champs optionnels (titre, description) pour guider l'IA.
 */
export async function analyzeSeriesImage(
  imageBuffer: Buffer,
  mimeType: string = 'image/jpeg',
  userTitle?: string | null,
  userDescription?: string | null,
  fileName?: string | null
) {
  if (!GEMINI_API_KEY) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing')

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const base64Data = imageBuffer.toString('base64')

  // Adapter le prompt selon ce qui est fourni
  let taskDescription = ''

  if (!userTitle && !userDescription) {
    // Cas 1: Image seule → Génération complète
    taskDescription = `Analyse cette image d'ambiance pour une collection de couture.
    
    IMPORTANT : Décris UNIQUEMENT ce que tu vois réellement dans l'image. Ne présume PAS que c'est fleuri si tu ne vois pas de fleurs. Ne présume PAS de motifs s'ils ne sont pas visibles.
    
    1. Identifie l'objet principal représenté (ex: marque-page, sac cabas, porte-monnaie, bouillotte...).
    2. Analyse précisément :
       - Les motifs RÉELS (floral, uni, géométrique, animalier, ou aucun motif visible)
       - Les matières RÉELLES (tissu, velours, coton, lin, peluche, cuir...)
       - Les couleurs dominantes
    3. Propose 3 options de titres ET leurs descriptions correspondantes :`
  } else if (userTitle && !userDescription) {
    // Cas 2: Image + Titre → Vérifier le titre et générer la description
    taskDescription = `L'utilisateur a fourni le titre suivant pour cette collection : "${userTitle}"
    
    Analyse l'image pour :
    1. Vérifier si le titre est cohérent avec l'image (corrige les fautes d'orthographe/grammaire si nécessaire)
    2. Générer 3 options de descriptions correspondant à ce titre ET à l'image :`
  } else if (!userTitle && userDescription) {
    // Cas 3: Image + Description → Générer le titre et vérifier la description
    taskDescription = `L'utilisateur a fourni la description suivante : "${userDescription}"
    
    Analyse l'image pour :
    1. Générer 3 options de titres cohérents avec cette description ET l'image
    2. Vérifier/améliorer la description fournie (corrige les fautes si nécessaire) :`
  } else {
    // Cas 4: Image + Titre + Description → Vérifier/améliorer les deux
    taskDescription = `L'utilisateur a fourni :
    - Titre : "${userTitle}"
    - Description : "${userDescription}"
    
    Analyse l'image pour :
    1. Vérifier/améliorer le titre (corrige les fautes, assure la cohérence avec l'image)
    2. Vérifier/améliorer la description (corrige les fautes, enrichis si nécessaire) :`
  }

  const fileContext = fileName ? `\nNote : Le fichier original se nomme "${fileName}". Utilise cette information comme un indice si le nom est explicite.\n` : ''

  const prompt = `${fileContext}${taskDescription}
       
       - "object": 
         * Titre : UNIQUEMENT le type d'objet au pluriel, SANS le mot "Collection" et SANS mentionner les motifs ni les matières (ex: "Bouillottes", "Marque-pages", "Sacs Cabas")
         * Description : Présente la collection de cet objet de manière générale (ex: "Découvrez nos bouillottes, alliant confort et élégance. Chaque pièce est confectionnée avec soin...")
       
       - "theme": 
         * Titre basé sur l'ambiance/saison visible dans CETTE image (ex: "Jardin Anglais", "Douceur Hivernale")
         * Description : Évoque le thème de cette image spécifique (ex: "Une collection aux motifs floraux délicats, évoquant les jardins anglais...")
       
       - "creative": 
         * Titre poétique/abstrait (ex: "Échos de Tendresse", "Murmures d'Atelier")
         * Description : Description lyrique et évocatrice (ex: "Cette image met en scène un accessoire délicat, confectionné avec soin...")
    
    Réponds uniquement au format JSON : 
    { 
      "titleOptions": { 
        "object": "...", 
        "theme": "...", 
        "creative": "..." 
      }, 
      "descriptionOptions": { 
        "object": "...", 
        "theme": "...", 
        "creative": "..." 
      } 
    }`

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
  mimeType: string = 'image/jpeg',
  fileNames?: string[]
) {
  if (!GEMINI_API_KEY) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing')

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const fileContext = (fileNames && fileNames.length > 0) ? `\nNote : Le fichier principal se nomme "${fileNames[0]}". Utilise cette information comme un indice si le nom est explicite.\n` : ''

  const prompt = `Voici une ou plusieurs photos d'une même création de couture.${fileContext}
    Analyse les détails, les textures et les formes.
    1. Suggère un titre (ex: "Le Sac Cabas en Lin").
    2. Rédige une description détaillant le soin apporté.
    3. Suggère un prix en Euros (nombre uniquement) basé sur la complexité apparente.
    4. Propose un texte alternatif (Alt) pour l'accessibilité SEO.
    5. Identifie les matériaux visibles (lin, coton, velours...) et les techniques (broderie, surpiqûres...).
    6. Identifie à laquelle de ces collections existantes elle appartient le mieux : ${existingSeries.join(', ')} (si aucune ne correspond, propose "Autre").
    
    Réponds uniquement au format JSON : { "title": "...", "description": "...", "details": "Matières : ... | Technique : ...", "price": 0, "alt": "...", "seriesMatch": "..." }`

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

/**
 * Génère un prompt d'image pour une collection et retourne les métadonnées
 */
export async function generateCollectionFromText(collectionName: string, existingCollections: string[] = []) {
  if (!GEMINI_API_KEY) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing')

  // Template de prompt pour la génération d'image (basé sur ton prompt original)
  const imagePrompt = `Vintage European catalog-style illustration of ${collectionName}, showcasing handmade textile details, craftsmanship, and artisanal construction. Soft floral or natural fabric patterns may be present depending on the item.

Illustrated in a refined ink and soft watercolor style, with fine, clean, slightly textured linework.

Surrounded by a hand-drawn ornamental floral filigree frame, featuring floral scrollwork, rinceaux motifs, and subtle sewing elements (thread spools, needles, thimble), inspired by early Art Nouveau and Victorian engraving ornamentation.

Color palette: warm cream, beige, linen tones, soft powdery pastels, with subtle muted red accents (antique burgundy / old carmine).

Background evokes antique catalog illustration paper, lightly textured, warm off-white.

Overall mood: elegant, nostalgic, handcrafted accessory, timeless couture.

High detail, editorial illustration quality, calm composition.`

  try {
    // Générer les métadonnées de la collection via Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const metadataPrompt = `Génère les métadonnées pour une collection de couture basée sur l'idée de l'utilisateur : "${collectionName}".

    Voici des exemples de titres de collections existantes pour t'inspirer du style (sans copier) : ${existingCollections.length > 0 ? existingCollections.join(', ') : 'Aucune collection existante'}.
    
    Propose 3 options de titres ET leurs descriptions correspondantes :
    
    - "object": 
      * Titre : Si l'entrée suggère un objet (ex: "Sacs"), utilise-le. Sinon, propose un type d'objet couture cohérent (ex: "Bouillottes", "Trousses").
      * Description : Présente la collection de manière générale.
    
    - "theme": 
      * Titre : Reprends le nom fourni par l'utilisateur ("${collectionName}") comme base. Tu peux le corriger ou l'embellir légèrement (majuscules, accord), mais GARDE L'ESPRIT de ce que l'utilisateur a écrit. C'est l'option "fidèle".
      * Description : Évoque le thème suggéré par ce titre.
    
    - "creative": 
      * Titre : Une reformulation poétique ou artistique du nom fourni.
      * Description : Description lyrique et évocatrice.
    
    Réponds uniquement au format JSON : 
    { 
      "titleOptions": { 
        "object": "...", 
        "theme": "...", 
        "creative": "..." 
      }, 
      "descriptionOptions": { 
        "object": "...", 
        "theme": "...", 
        "creative": "..." 
      } 
    }`

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT_BASE },
      { text: metadataPrompt }
    ])

    const response = await result.response
    const text = response.text()
    const metadata = parseAIResponse(text)

    return {
      imagePrompt,
      ...metadata
    }
  } catch (error) {
    logger.error('Failed to generate collection metadata from text', error)
    throw new Error('Collection generation failed')
  }
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

/**
 * Génère une image via Gemini.
 * Utilise le modèle Gemini 2.0 Flash avec des tentatives automatiques (retry)
 * pour gérer les erreurs de quota (429).
 */
export async function generateImage(prompt: string): Promise<Buffer> {
  if (!GEMINI_API_KEY) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing')

  // Le modèle qui a répondu (même avec une erreur 429) était gemini-2.0-flash
  // Utilisation du modèle demandé par l'utilisateur: Gemini 2.5 Flash TTS (Multimodal)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-tts',
  })

  let attempt = 0
  const maxRetries = 3

  while (attempt < maxRetries) {
    try {
      const result = await model.generateContent(prompt)
      const response = await result.response

      // L'API renvoie généralement l'image dans les 'parts' sous forme d'inlineData
      const candidate = response.candidates?.[0]
      const imagePart = candidate?.content?.parts?.find(p => p.inlineData)

      if (imagePart && imagePart.inlineData) {
        return Buffer.from(imagePart.inlineData.data, 'base64')
      }

      // Si on a du texte à la place de l'image (cas d'erreur courant)
      const textPart = candidate?.content?.parts?.find(p => p.text)
      if (textPart) {
        logger.warn('Gemini returned text instead of image:', textPart.text)
      }

      throw new Error('Aucune donnée image trouvée dans la réponse Gemini')

    } catch (error: any) {
      // Gestion spécifique des erreurs de Quota (429)
      const isQuotaError = error.message?.includes('429') || error.message?.includes('Quota') || error.status === 429

      if (isQuotaError && attempt < maxRetries - 1) {
        attempt++
        const waitTime = 20000 // Attendre 20 secondes
        logger.warn(`Gemini 429 Quota Exceeded. Retrying in ${waitTime / 1000}s... (Attempt ${attempt}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }

      logger.error('Gemini Image Generation Failed', error)
      throw new Error('Gemini Image Generation failed')
    }
  }

  throw new Error('Gemini Image Generation failed after retries')
}
