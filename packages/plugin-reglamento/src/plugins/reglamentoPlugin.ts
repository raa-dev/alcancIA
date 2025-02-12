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

    constructor() {
        console.log('[ReglamentoPlugin] Constructor iniciado')
        try {
            const rootPath = join(process.cwd(), '..')
            const reglamentoPath = join(rootPath, 'knowledge', 'reglamentos', 'reglamento_general.md')
            
            if (!existsSync(reglamentoPath)) {
                console.error('[ReglamentoPlugin] ERROR: Archivo no encontrado en:', reglamentoPath)
                throw new Error(`Archivo no encontrado en: ${reglamentoPath}`)
            }
            
            this.reglamento = readFileSync(reglamentoPath, 'utf-8')
            console.log('[ReglamentoPlugin] Archivo cargado. Tamaño:', this.reglamento.length)
        } catch (error) {
            console.error('[ReglamentoPlugin] Error en constructor:', error)
            throw error
        }
    }

    async onInit(_context: Content) {
        console.log('[ReglamentoPlugin] onInit llamado')
        console.log('[ReglamentoPlugin] Contexto:', JSON.stringify(_context))
        
        if (!this.reglamento) {
            console.error('[ReglamentoPlugin] ERROR: No hay reglamento cargado')
            return { systemPrompt: '' }
        }

        const systemPrompt = `
        INSTRUCCIONES CRÍTICAS - NO NEGOCIABLES:
        Eres un asistente especializado ÚNICAMENTE en el reglamento del condominio.
        
        REGLAMENTO ACTUAL:
        ${this.reglamento}

        REGLAS ABSOLUTAS:
        1. SOLO puedes responder usando información que aparezca TEXTUALMENTE en el reglamento anterior
        2. Cada respuesta DEBE incluir una cita textual del artículo relevante
        3. Si la información NO está en el reglamento, responde EXACTAMENTE: "Lo siento, esa información no está especificada en el reglamento."
        4. NO debes hacer suposiciones ni inferencias
        5. NO debes usar conocimiento externo
        6. Si te preguntan algo fuera del reglamento, indica que solo puedes responder sobre el reglamento
        7. Formato obligatorio de citas: "Según el Artículo X: [cita textual]"

        ADVERTENCIA: Incumplir estas reglas es una falta grave.
        `

        console.log('[ReglamentoPlugin] systemPrompt generado')
        console.log('[ReglamentoPlugin] Longitud del systemPrompt:', systemPrompt.length)
        console.log('[ReglamentoPlugin] Primeras 100 caracteres:', systemPrompt.substring(0, 100))
        
        return { 
            systemPrompt,
            forceSystemPrompt: true,
            useRAG: true,
            forceRAG: true,
            ragContent: this.reglamento,
            ragOptions: {
                enabled: true,
                force: true
            }
        }
    }
}