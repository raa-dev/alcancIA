import { z } from 'zod'

const configSchema = z.object({
  apiToken: z.string(),
  apiUrl: z.string().url(),
  apiPort: z.string()
})

type Config = z.infer<typeof configSchema>

interface SaveFileParams {
  path: string
  content: string
}

interface GetFileParams {
  path: string
}

interface SearchParams {
  query: string
}

export class ObsidianClient {
  private config: Config

  constructor() {
    const apiToken = process.env.OBSIDIAN_API_TOKEN
    const apiUrl = process.env.OBSIDIAN_API_URL
    const apiPort = process.env.OBSIDIAN_API_PORT

    console.log('[ObsidianClient] Configuración:', {
      apiUrl,
      apiPort,
      hasToken: !!apiToken
    })

    if (!apiToken || !apiUrl || !apiPort) {
      throw new Error('Faltan variables de entorno para Obsidian API')
    }

    this.config = configSchema.parse({
      apiToken,
      apiUrl,
      apiPort
    })
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.config.apiToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`Error en la API de Obsidian: ${response.statusText}`)
    }

    return response.json()
  }

  async saveFile({ path, content }: SaveFileParams): Promise<void> {
    const url = `${this.config.apiUrl}/vault/${encodeURIComponent(path)}`
    console.log('[ObsidianClient] Intentando guardar archivo:', { url, path })
    
    const headers = {
      'Authorization': `Bearer ${this.config.apiToken}`,
      'Content-Type': 'text/markdown',
      'X-Create-Directories': 'true'
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: content
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[ObsidianClient] Error en la respuesta:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        throw new Error(`Error en la API de Obsidian: ${response.status} ${response.statusText} - ${errorText}`)
      }
    } catch (error) {
      console.error('[ObsidianClient] Error al guardar archivo:', error)
      throw error
    }
  }

  async getFile({ path }: GetFileParams): Promise<string> {
    const url = `${this.config.apiUrl}/vault/${encodeURIComponent(path)}`
    console.log('[ObsidianClient] Intentando leer archivo:', { url, path })
    
    const headers = {
      'Authorization': `Bearer ${this.config.apiToken}`,
      'Accept': 'text/markdown'
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        if (response.status === 404) {
          console.log('[ObsidianClient] Archivo no encontrado:', path)
          return ''
        }
        const errorText = await response.text()
        console.error('[ObsidianClient] Error al leer archivo:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        throw new Error(`Error en la API de Obsidian: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const content = await response.text()
      console.log('[ObsidianClient] Archivo leído exitosamente:', { path, contentLength: content.length })
      return content
    } catch (error) {
      console.error('[ObsidianClient] Error al leer archivo:', error)
      throw error
    }
  }

  async search({ query }: SearchParams): Promise<string[]> {
    const response = await this.request<{ results: string[] }>('/vault/search', {
      method: 'POST',
      body: JSON.stringify({ query })
    })
    return response.results
  }

  async listFiles(): Promise<string[]> {
    const response = await this.request<{ files: string[] }>('/vault/')
    return response.files
  }

  async createDirectory(path: string): Promise<void> {
    await this.request(`/vault/${encodeURIComponent(path)}/`, {
      method: 'POST',
      body: JSON.stringify({})
    })
  }
} 