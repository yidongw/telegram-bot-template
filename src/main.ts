#!/usr/bin/env tsx

import process from 'node:process'
import type { RunnerHandle } from '@grammyjs/runner'
import { run } from '@grammyjs/runner'
import { createBot } from '#root/bot/index.js'
import { config } from '#root/config.js'
import { logger } from '#root/logger.js'

function onShutdown(cleanUp: () => Promise<void>) {
  let isShuttingDown = false
  const handleShutdown = async () => {
    if (isShuttingDown)
      return
    isShuttingDown = true
    logger.info('Shutdown')
    await cleanUp()
  }
  process.on('SIGINT', handleShutdown)
  process.on('SIGTERM', handleShutdown)
}

try {
  const bot = createBot(config.BOT_TOKEN)
  let runner: undefined | RunnerHandle

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')

    await runner?.stop()
  })

  // to prevent receiving updates before the bot is ready
  await bot.init()

  logger.info({
    msg: 'Bot running...',
    username: bot.botInfo.username,
  })

  runner = run(bot, {
    runner: {
      fetch: {
        allowed_updates: config.BOT_ALLOWED_UPDATES,
      },
    },
  })
}
catch (error) {
  logger.error(error)
  process.exit(1)
}
