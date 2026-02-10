import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('can submit the contact form', async () => {
    const { submitContactForm } = await import('@/app/(frontend)/contact/actions')

    const result = await submitContactForm({
      name: 'Test Tester',
      email: 'test@example.com',
      message: 'Hello from integration test',
    })

    expect(result.success).toBe(true)

    // Verify it was created in the database
    const messages = await payload.find({
      collection: 'messages',
      where: {
        email: {
          equals: 'test@example.com',
        },
      },
    })

    expect(messages.docs.length).toBeGreaterThan(0)
    expect(messages.docs[0].name).toBe('Test Tester')
  })
})
