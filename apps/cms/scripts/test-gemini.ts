import { analyzeSeriesImage } from '../src/lib/ai/gemini'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

const envPath = path.resolve(process.cwd(), '.env.development')
console.log(`📂 Chargement de l'env depuis : ${envPath}`)
const result = dotenv.config({ path: envPath })
if (result.error) {
    console.error("❌ Erreur lors du chargement de .env.development :", result.error)
}

console.log("🔑 Clés détectées :", Object.keys(process.env).filter(k => k.includes('API') || k.includes('KEY') || k.includes('AI')))

async function testIA() {
    console.log("🧪 Test de l'IA Gemini...")

    // On utilise l'icône du site comme image de test
    const imagePath = path.join(process.cwd(), 'public/icon.png')

    if (!fs.existsSync(imagePath)) {
        console.error("❌ Image de test introuvable :", imagePath)
        return
    }

    const buffer = fs.readFileSync(imagePath)

    try {
        console.log("⏳ Analyse de l'image de collection...")
        const result = await analyzeSeriesImage(buffer)
        console.log("✅ Résultat de l'IA :", JSON.stringify(result, null, 2))
    } catch (error) {
        console.error("❌ Échec du test :", error)
    }
}

testIA()
