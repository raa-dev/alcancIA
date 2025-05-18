import { z } from 'zod'
import { ActionResponse } from '../types/actions'

type ActionDefinition<TInput, TOutput> = {
  input: z.ZodType<TInput>
  handler: (input: TInput) => Promise<ActionResponse<TOutput>>
}

export function action<TInput, TOutput>(
  schema: z.ZodType<TInput>,
  handler: (input: TInput) => Promise<ActionResponse<TOutput>>
) {
  return async (input: unknown): Promise<ActionResponse<TOutput>> => {
    try {
      const validatedInput = schema.parse(input)
      return await handler(validatedInput)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: {
            message: 'Error de validación',
            details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
          }
        }
      }

      return {
        success: false,
        error: {
          message: 'Error interno',
          details: error instanceof Error ? error.message : 'Error desconocido'
        }
      }
    }
  }
} 