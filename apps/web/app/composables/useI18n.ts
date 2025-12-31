import { computed } from 'vue'
import { STRINGS_FR } from '../assets/locales/fr'
import type { UiString } from '@machi10/types'

export const useI18n = () => {
    const { getGlobals } = usePayload()

    // On récupère les données du CMS
    const { data } = useAsyncData<UiString>('ui-strings', () => getGlobals('ui-strings'))

    /**
     * Accès réactif aux strings du CMS avec fallback sur les constantes locales
     */
    const ui = computed(() => {
        return {
            nav: { ...STRINGS_FR.nav, ...data.value?.nav },
            hero: { ...STRINGS_FR.hero, ...data.value?.hero },
            collections: { ...STRINGS_FR.collections, ...data.value?.collections },
            contact: { ...STRINGS_FR.contact, ...data.value?.contact },
            about: { ...STRINGS_FR.about, ...data.value?.about },
            common: { ...STRINGS_FR.common, ...data.value?.common },
        }
    })

    return {
        ui,
        d: STRINGS_FR // Defaults bruts si besoin
    }
}
