import {
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type State,
  elizaLogger
} from "@elizaos/core"
import { ObsidianClient } from "../client"

const DEFAULT_PATH = "Condominio/Vecinos/Registro de Vecinos.md"

export const listVecinosAction: Action = {
  name: "LIST_VECINOS",
  similes: [
    "LISTAR_VECINOS", "VER_VECINOS", "MOSTRAR_VECINOS", "LIST_NEIGHBORS", "SHOW_NEIGHBORS", "LIST_VECINOS", "LISTAR VECINOS", "VER VECINOS"
  ],
  description: "Lista todos los vecinos registrados en el archivo Registro de Vecinos.md",
  validate: async (_runtime: IAgentRuntime) => true,
  handler: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback
  ) => {
    try {
      elizaLogger.info(`[LIST_VECINOS] _options recibidas:`, _options)
      const path = _options?.registroPath || DEFAULT_PATH
      elizaLogger.info(`[LIST_VECINOS] Path final a leer: ${path}`)
      const client = new ObsidianClient()
      elizaLogger.info(`[LIST_VECINOS] Leyendo archivo: ${path}`)
      let contenido = ""
      try {
        contenido = await client.getFile({ path })
      } catch (e) {
        elizaLogger.error(`[LIST_VECINOS] No se pudo leer el archivo: ${path}`, e)
        const errorResponse = {
          text: `No se pudo leer el archivo de vecinos en: ${path}`,
          action: "LIST_VECINOS",
          error: true
        }
        await callback(errorResponse)
        return errorResponse
      }

      // Parsear vecinos: buscar bloques que empiecen con '- Casa:'
      const vecinos: Array<{ casa: string, nombre: string, direccion: string, estado: string }> = []
      const regex = /- Casa: (.+?)\n  - Nombre: (.+?)\n  - Dirección: (.+?)\n  - Estado: (.+?)(?:\n|$)/g
      let match
      while ((match = regex.exec(contenido)) !== null) {
        vecinos.push({
          casa: match[1].trim(),
          nombre: match[2].trim(),
          direccion: match[3].trim(),
          estado: match[4].trim()
        })
      }

      if (!vecinos.length) {
        const emptyResponse = {
          text: "No hay vecinos registrados.",
          action: "LIST_VECINOS"
        }
        await callback(emptyResponse)
        return emptyResponse
      }

      // Formato tabla Markdown
      const tabla = [
        '| Casa | Nombre | Dirección | Estado |',
        '|------|--------|-----------|--------|',
        ...vecinos.map(v => `| ${v.casa} | ${v.nombre} | ${v.direccion} | ${v.estado} |`)
      ].join('\n')

      const response = {
        text: `Lista de vecinos registrados (tabla):\n\n${tabla}`,
        action: "LIST_VECINOS",
        data: vecinos
      }
      await callback(response)
      return response
    } catch (error) {
      elizaLogger.error("[LIST_VECINOS] Error inesperado:", error)
      const errorResponse = {
        text: "Error al listar vecinos.",
        action: "LIST_VECINOS",
        error: true
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
          text: "Donna, muestra la lista de vecinos",
          action: "LIST_VECINOS"
        }
      }
    ]
  ]
} 