import {
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type State,
  elizaLogger,
  generateObject,
  ModelClass,
  composeContext
} from "@elizaos/core"
import { ObsidianClient } from "../client"
import { z } from "zod"

const addVecinoSchema = z.object({
  casa: z.string(),
  nombre: z.string(),
  direccion: z.string(),
  estado: z.string().default('Activo'),
  registroPath: z.string().optional()
})

const addVecinoTemplate = (userRequest: string) => `
Eres una asistente que ayuda a registrar vecinos en un condominio.
Extrae los siguientes campos del mensaje del usuario y responde SOLO con un objeto JSON:
- casa: número o identificador de la casa
- nombre: nombre completo del vecino
- direccion: dirección de wallet (0x...)
- estado: estado del vecino (opcional, por defecto 'Activo')

Ejemplo de respuesta:
{
  "casa": "22",
  "nombre": "Mariana Gómez",
  "direccion": "0x9876543210abcdef9876543210abcdef98765432",
  "estado": "Activo"
}

Mensaje del usuario:
${userRequest}

Responde SOLO con un objeto JSON.`

export const addVecinoAction: Action = {
  name: "ADD_VECINO",
  similes: [
    "AGREGAR_VECINO", "NUEVO_VECINO", "REGISTRAR_VECINO",
    "agrega un vecino", "añadir vecino", "registrar vecino", "nuevo vecino", "alta de vecino",
    "Donna, agrega un vecino", "Donna, registra un vecino", "Donna, añade vecino",
    "agregar vecino al registro", "registrar nuevo vecino", "alta vecino"
  ],
  description: "Agrega un nuevo vecino al registro de vecinos en Obsidian",
  validate: async (_runtime: IAgentRuntime) => true,
  handler: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State,
    _options: unknown,
    callback: HandlerCallback
  ) => {
    try {
      elizaLogger.info("[ADD_VECINO] Handler iniciado", { message: _message.content.text })
      
      let currentState: State
      if (!_state) {
        currentState = (await _runtime.composeState(_message)) as State
      } else {
        currentState = await _runtime.updateRecentMessageState(_state)
      }

      const context = composeContext({
        state: currentState,
        template: addVecinoTemplate(_message.content.text as string)
      })

      const vecinoContext = await generateObject({
        runtime: _runtime,
        context,
        modelClass: ModelClass.SMALL,
        schema: addVecinoSchema,
        stop: ["\n"]
      }) as any

      const { casa, nombre, direccion, estado, registroPath } = vecinoContext.object
      elizaLogger.info(`[ADD_VECINO] Parámetros extraídos: casa=${casa}, nombre=${nombre}, direccion=${direccion}, estado=${estado}, registroPath=${registroPath}`)
      
      const client = new ObsidianClient()
      const path = registroPath || "Condominio/Vecinos/Registro de Vecinos.md"
      elizaLogger.info(`[ADD_VECINO] Intentando leer archivo: ${path}`)
      
      let contenido = ""
      try {
        contenido = await client.getFile({ path })
        elizaLogger.info("[ADD_VECINO] Contenido actual del archivo:", contenido)
        if (!contenido.trim()) {
          elizaLogger.warn("[ADD_VECINO] El archivo está vacío, creando nuevo contenido")
          contenido = "# Registro de Vecinos\n\n"
        }
      } catch (e) {
        elizaLogger.warn(`[ADD_VECINO] No se pudo leer el archivo, se creará uno nuevo. Error:`, e)
        contenido = "# Registro de Vecinos\n\n"
      }

      // Asegurarnos de que el contenido tenga el formato correcto
      if (!contenido.startsWith("# Registro de Vecinos")) {
        contenido = "# Registro de Vecinos\n\n" + contenido
      }

      // Verificar si el vecino ya existe
      const vecinoExistente = contenido.includes(`Casa: ${casa}`)
      if (vecinoExistente) {
        elizaLogger.warn(`[ADD_VECINO] La casa ${casa} ya está registrada`)
        const errorResponse = {
          text: `La casa ${casa} ya está registrada en el sistema`,
          action: "ADD_VECINO",
          error: true
        }
        await callback(errorResponse)
        return errorResponse
      }

      const nuevoVecino = `- Casa: ${casa}\n  - Nombre: ${nombre}\n  - Dirección: ${direccion}\n  - Estado: ${estado || "Activo"}\n\n`
      const nuevoContenido = contenido.trimEnd() + "\n" + nuevoVecino
      
      elizaLogger.info(`[ADD_VECINO] Contenido a guardar:`, nuevoContenido)
      elizaLogger.info(`[ADD_VECINO] Intentando guardar archivo: ${path}`)
      await client.saveFile({ path, content: nuevoContenido })
      elizaLogger.info(`[ADD_VECINO] Vecino agregado correctamente en: ${path}`)

      const response = {
        text: `Vecino agregado correctamente: Casa ${casa}`,
        action: "ADD_VECINO"
      }
      await callback(response)
      return response
    } catch (error) {
      elizaLogger.error("[ADD_VECINO] Error al agregar vecino:", error)
      const errorResponse = {
        text: "Error al agregar vecino",
        action: "ADD_VECINO",
        content: { error: error instanceof Error ? error.message : "Error desconocido" }
      }
      await callback(errorResponse)
      return errorResponse
    }
  },
  examples: [
    [
      {
        user: "user",
        content: {
          text: "Donna, agrega un vecino nuevo: Casa 22, Nombre: Mariana Gómez, Dirección: 0x9876543210abcdef9876543210abcdef98765432, Estado: Activo",
          action: "ADD_VECINO"
        }
      }
    ],
    [
      {
        user: "user",
        content: {
          text: "Registrar vecino: Casa 23, Nombre: Luis Pérez, Dirección: 0xabc..., Estado: Activo",
          action: "ADD_VECINO"
        }
      }
    ],
    [
      {
        user: "user",
        content: {
          text: "Añadir vecino: Casa 25, Nombre: Sofía Martínez, Dirección: 0xdef..., Estado: Activo",
          action: "ADD_VECINO"
        }
      }
    ],
    [
      {
        user: "user",
        content: {
          text: "Alta de vecino: Casa 26, Nombre: Pablo Ruiz, Dirección: 0x123..., Estado: Activo",
          action: "ADD_VECINO"
        }
      }
    ]
  ]
} 