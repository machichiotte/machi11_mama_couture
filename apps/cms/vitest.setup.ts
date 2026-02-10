// Any setup scripts you might need go here

// Load .env files
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(__dirname, '.env.test') })
