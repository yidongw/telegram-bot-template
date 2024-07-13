import process from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from '#root/config.js'
import { logger } from '#root/logger.js'

export const client = postgres(config.DATABASE_URL)

export async function testConnection() {
  try {
  // Run a simple query to test the connection
    await client`SELECT 1 AS connected`
    logger.info({
      msg: 'Connected to DB',
    })
  }
  catch (error) {
    logger.error({
      msg: 'Error connecting to the database',
      error,
    })
    // Stop the process
    process.exit(1)
  }
}

const db = drizzle(client)

export default db
