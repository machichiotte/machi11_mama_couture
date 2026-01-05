export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    // On ne lance le réveil que côté client
    if (import.meta.client) {
        // Ping le backend toutes les 14 minutes pour empêcher le sommeil de Render 
        // ou simplement au chargement initial pour le réveiller si besoin.
        // L'URL /api/globals/site-settings est légère et publique.

        const wakeUpBackend = () => {
            const baseUrl = config.public.payloadBaseUrl || ''
            // On utilise l'URL absolue si possible, sinon le proxy relatif fonctionne aussi
            // mais l'absolu est plus sûr pour 'réveiller' le service spécifique Render
            const pingUrl = baseUrl.includes('localhost') ? '/api/globals/site-settings' : `${baseUrl}/api/globals/site-settings`

            console.log('⏰ Mama Couture: Réveil du backend en cours...')

            fetch(pingUrl).catch(() => {
                // On ignore les erreurs de réseau ou de CORS ici
                // car le but est simplement que la requête atteigne Render.
            })
        }

        // Réveil immédiat au chargement
        wakeUpBackend()

        // Puis toutes les 14 minutes (juste sous la limite des 15m de Render)
        setInterval(wakeUpBackend, 14 * 60 * 1000)
    }
})
