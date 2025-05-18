import { z } from 'zod'
import { action } from '../lib/safe-action'
import { ObsidianClient } from '../client'
import { ActionResponse } from '../types/actions'

const addVecinoSchema = z.object({
  casa: z.string(),
  nombre: z.string(),
  direccion: z.string(),
  estado: z.string().default('Activo'),
  registroPath: z.string().default('Condominio/Vecinos/Registro de Vecinos.md')
})

export const addVecino = action(
  addVecinoSchema,
  async ({ casa, nombre, direccion, estado, registroPath }): Promise<ActionResponse> => {
    try {
      const client = new ObsidianClient()
      let contenido = ''
      try {
        contenido = await client.getFile({ path: registroPath })
      } catch (e) {
        // Si el archivo no existe, lo creamos con el encabezado
        contenido = '# Registro de Vecinos\n\n'
      }

      // Formato del nuevo vecino
      const nuevoVecino = `- Casa: ${casa}\n  - Nombre: ${nombre}\n  - Dirección: ${direccion}\n  - Estado: ${estado}\n\n`

      // Agregar el nuevo vecino al final
      const nuevoContenido = contenido.trimEnd() + '\n' + nuevoVecino

      await client.saveFile({
        path: registroPath,
        content: nuevoContenido
      })

      return {
        success: true,
        data: {
          message: `Vecino agregado correctamente: Casa ${casa}`
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Error al agregar vecino',
          details: error instanceof Error ? error.message : 'Error desconocido'
        }
      }
    }
  }
) 