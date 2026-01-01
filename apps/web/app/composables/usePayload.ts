import type { Config } from '@machi10/types'

export const usePayload = () => {
    const config = useRuntimeConfig()
    const baseUrl = config.public.payloadBaseUrl as string

    const getGlobals = async <T extends keyof Config['globals']>(slug: T): Promise<Config['globals'][T]> => {
        return await $fetch(`/api/globals/${slug}`)
    }

    const getCollection = async <T extends keyof Config['collections']>(slug: T, params = {}): Promise<{ docs: Config['collections'][T][] }> => {
        return await $fetch(`/api/${slug}`, { query: params })
    }

    const getById = async <T extends keyof Config['collections']>(slug: T, id: string): Promise<Config['collections'][T]> => {
        return await $fetch(`/api/${slug}/${id}`)
    }

    const findBySlug = async <T extends keyof Config['collections']>(collection: T, slug: string): Promise<Config['collections'][T] | null> => {
        const response = await $fetch<{ docs: Config['collections'][T][] }>(`/api/${collection}`, {
            query: {
                where: {
                    slug: { equals: slug }
                }
            }
        })
        return response.docs?.[0] || null
    }

    const create = async <T extends keyof Config['collections']>(slug: T, data: any): Promise<Config['collections'][T]> => {
        return await $fetch(`/api/${slug}`, {
            method: 'POST' as any,
            body: data
        })
    }

    const getImageUrl = (image: any): string => {
        if (!image) return ''
        const url = typeof image === 'string' ? image : image.url
        if (!url) return ''

        // Si l'URL est déjà absolue (Cloudinary), on la renvoie telle quelle
        if (url.startsWith('http')) return url

        // Sinon on rajoute la base URL du CMS
        return `${baseUrl}${url}`
    }

    return {
        getGlobals,
        getCollection,
        getById,
        findBySlug,
        create,
        getImageUrl
    }
}
