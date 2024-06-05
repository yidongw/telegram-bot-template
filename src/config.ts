import process from 'node:process'
import z from 'zod'
import { parseEnv } from 'znv'
import { API_CONSTANTS } from 'grammy'

try {
  process.loadEnvFile()
}
catch {
  // No .env file found
}

function createConfigFromEnvironment(environment: NodeJS.ProcessEnv) {
  const config = parseEnv(environment, {
    NODE_ENV: z.enum(['development', 'production']),
    LOG_LEVEL: z
      .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
      .default('info'),
    BOT_TOKEN: z.string(),
    BOT_ALLOWED_UPDATES: z
      .array(z.enum(API_CONSTANTS.ALL_UPDATE_TYPES))
      .default([]),
    BOT_ADMINS: z.array(z.number()).default([]),
  })

  return {
    ...config,
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  }
}

export type Config = ReturnType<typeof createConfigFromEnvironment>

export const config = createConfigFromEnvironment(process.env)
