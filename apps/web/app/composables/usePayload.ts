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
            method: 'POST',
            body: data
        })
    }

    return {
        getGlobals,
        getCollection,
        getById,
        create
    }
}
