#!/usr/bin/env tsx

import process from 'node:process'
import { createBot } from '#root/bot/index.js'
import { config } from '#root/config.js'
import { logger } from '#root/logger.js'
import { createServer, createServerManager } from '#root/server/index.js'
import drizzle, { client, testConnection } from '#root/db/index.js'

function onShutdown(cleanUp: () => Promise<void>) {
  let isShuttingDown = false
  const handleShutdown = async () => {
    if (isShuttingDown)
      return
    isShuttingDown = true
    logger.info('Shuting down')
    await cleanUp()
    logger.info('Shutdown complete')
    process.exit(0)
  }
  process.on('SIGINT', handleShutdown)
  process.on('SIGTERM', handleShutdown)
}

async function startPolling() {
  const bot = createBot(config.BOT_TOKEN, {
    drizzle,
  })

  // graceful shutdown
  onShutdown(async () => {
    await bot.stop()
    await client.end({ timeout: 5 })
  })

  // test connect to database
  await testConnection()

  // start bot
  await bot.start({
    allowed_updates: config.BOT_ALLOWED_UPDATES,
    onStart: ({ username }) =>
      logger.info({
        msg: 'Bot running...',
        username,
      }),
  })
}

async function startWebhook() {
  const bot = createBot(config.BOT_TOKEN, {
    drizzle,
  })
  const server = createServer(bot)
  const serverManager = createServerManager(server)

  // graceful shutdown
  onShutdown(async () => {
    await serverManager.stop()
    await client.end({ timeout: 5 })
  })

  // test connect to database
  await testConnection()

  // to prevent receiving updates before the bot is ready
  await bot.init()

  // start server
  const info = await serverManager.start(
    config.BOT_SERVER_HOST,
    config.BOT_SERVER_PORT,
  )
  logger.info({
    msg: 'Server started',
    url: info.url,
  })

  // set webhook
  await bot.api.setWebhook(config.BOT_WEBHOOK, {
    allowed_updates: config.BOT_ALLOWED_UPDATES,
    secret_token: config.BOT_WEBHOOK_SECRET,
  })
  logger.info({
    msg: 'Webhook was set',
    url: config.BOT_WEBHOOK,
  })
}

try {
  if (config.BOT_MODE === 'webhook')
    await startWebhook()
  else if (config.BOT_MODE === 'polling')
    await startPolling()
}
catch (error) {
  logger.error(error)
  process.exit(1)
}
