import { defineConfig } from 'drizzle-kit'
import { config } from './src/config'

export default defineConfig({
  dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
  schema: './src/db/schemas/pg/*',
  out: './drizzle',
  dbCredentials: {
    url: config.DATABASE_URL,
  },
})
