import { Plugin, Content } from '@elizaos/core'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface ReglamentoSection {
    title: string
    content: string
    articles: string[]
}

export class ReglamentoPlugin implements Plugin {
    name = 'reglamento'
    description = 'Plugin para manejar el reglamento del condominio'
    
    private reglamento: string
    private sections: ReglamentoSection[] = []

    constructor() {
        console.log('[ReglamentoPlugin] Constructor iniciado')
        try {
            // Subir un nivel desde agent/
            const rootPath = join(process.cwd(), '..')
            console.log('[ReglamentoPlugin] CWD:', process.cwd())
            console.log('[ReglamentoPlugin] Root Path:', rootPath)
            
            const reglamentoPath = join(rootPath, 'knowledge', 'reglamentos', 'reglamento_general.md')
            console.log('[ReglamentoPlugin] Ruta completa:', reglamentoPath)
            
            if (!existsSync(reglamentoPath)) {
                console.error('[ReglamentoPlugin] ERROR: Archivo no encontrado en:', reglamentoPath)
                throw new Error(`Archivo no encontrado en: ${reglamentoPath}`)
            }
            
            this.reglamento = readFileSync(reglamentoPath, 'utf-8')
            console.log('[ReglamentoPlugin] Archivo cargado. Tamaño:', this.reglamento.length)
            console.log('[ReglamentoPlugin] Primeras líneas:', this.reglamento.split('\n').slice(0, 3).join('\n'))
        } catch (error) {
            console.error('[ReglamentoPlugin] Error en constructor:', error)
            throw error
        }
    }

    private parseReglamento() {
        const sections = this.reglamento.split(/(?=# )/)
        this.sections = sections.map(section => {
            const titleMatch = section.match(/^#+ (.+)/)
            const title = titleMatch ? titleMatch[1] : ''
            const articles = section.match(/### \*\*ARTÍCULO \d+\*\*/g) || []
            return {
                title,
                content: section,
                articles: articles.map(a => a.replace(/### \*\*ARTÍCULO (\d+)\*\*/, '$1'))
            }
        })
    }

    async onInit(_context: Content) {
        console.log('Reglamento Plugin initialized')
        
        const systemPrompt = `
        Como Donna, tienes acceso al Reglamento Interno del Condominio. 
        Cuando respondas preguntas sobre el reglamento:
        1. Cita el artículo específico como fuente
        2. Sé precisa y concisa en tus respuestas
        3. Si la información no está en el reglamento, indícalo claramente
        4. Usa un tono profesional pero amigable
        
        El reglamento completo es:
        ${this.reglamento}
        `

        return {
            systemPrompt,
            functions: [
                {
                    name: 'buscarArticulo',
                    description: 'Busca un artículo específico en el reglamento',
                    parameters: {
                        type: 'object',
                        properties: {
                            numero: {
                                type: 'string',
                                description: 'Número del artículo a buscar'
                            }
                        },
                        required: ['numero']
                    }
                },
                {
                    name: 'buscarSeccion',
                    description: 'Busca una sección específica del reglamento',
                    parameters: {
                        type: 'object',
                        properties: {
                            titulo: {
                                type: 'string',
                                description: 'Título de la sección a buscar'
                            }
                        },
                        required: ['titulo']
                    }
                }
            ]
        }
    }

    async buscarArticulo({ numero }: { numero: string }) {
        const articleRegex = new RegExp(`### \\*\\*ARTÍCULO ${numero}\\*\\*[^#]+`)
        const match = this.reglamento.match(articleRegex)
        return match ? match[0].trim() : 'Artículo no encontrado'
    }

    async buscarSeccion({ titulo }: { titulo: string }) {
        const section = this.sections.find(s => 
            s.title.toLowerCase().includes(titulo.toLowerCase())
        )
        return section ? section.content : 'Sección no encontrada'
    }
}