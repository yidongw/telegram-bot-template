import type { InferSelectModel } from 'drizzle-orm'
import { bigint, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = pgTable('users', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  telegramId: bigint('telegram_id', { mode: 'number' }).unique(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Select User Schema
export const selectUserSchema = createSelectSchema(users)

// Add User Schema
export const addUserSchema = z.object({
  body: selectUserSchema.pick({
    telegramId: true,
  }),
})

// Update User Schema
export const updateUserSchema = z.object({
  body: selectUserSchema
    .pick({
      telegramId: true,
    }),
})

// Delete User Schema (with id)
export const deleteUserSchema = z.object({
  body: selectUserSchema.pick({
    id: true,
  }),
})

// Define types based on the schemas
export type User = InferSelectModel<typeof users>
export type AddUser = z.infer<typeof addUserSchema>['body']
export type UpdateUser = z.infer<typeof updateUserSchema>['body']
export type DeleteUser = z.infer<typeof deleteUserSchema>['body']
