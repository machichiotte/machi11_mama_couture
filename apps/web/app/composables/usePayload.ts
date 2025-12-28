import type { Config } from '@machi10/types'

export const usePayload = () => {
    const config = useRuntimeConfig()
    const baseUrl = config.public.payloadBaseUrl as string

    const getGlobals = async <T extends keyof Config['globals']>(slug: T): Promise<Config['globals'][T]> => {
        return await $fetch(`${baseUrl}/api/globals/${slug}`)
    }

    const getCollection = async <T extends keyof Config['collections']>(slug: T, params = {}): Promise<{ docs: Config['collections'][T][] }> => {
        return await $fetch(`${baseUrl}/api/${slug}`, { query: params })
    }

    const getById = async <T extends keyof Config['collections']>(slug: T, id: string): Promise<Config['collections'][T]> => {
        return await $fetch(`${baseUrl}/api/${slug}/${id}`)
    }

    const create = async <T extends keyof Config['collections']>(slug: T, data: any): Promise<Config['collections'][T]> => {
        return await $fetch(`${baseUrl}/api/${slug}`, {
            method: 'POST' as any,
            body: data
        })
    }

    const getImageUrl = (image: any): string => {
        if (!image) return ''
        const url = typeof image === 'string' ? image : image.url
        if (!url) return ''

        // Debug pour voir ce que le CMS nous envoie
        console.log('[getImageUrl] Input:', image)

        let finalUrl = ''
        // Si l'URL est déjà absolue (Cloudinary), on la renvoie telle quelle
        if (url.startsWith('http')) {
            finalUrl = url
        } else {
            // Sinon on rajoute la base URL du CMS
            finalUrl = `${baseUrl}${url}`
        }

        console.log('[getImageUrl] Output:', finalUrl)
        return finalUrl
    }

    return {
        getGlobals,
        getCollection,
        getById,
        create,
        getImageUrl
    }
}
