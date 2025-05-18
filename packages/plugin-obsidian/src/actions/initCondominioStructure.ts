import { z } from 'zod'
import { action } from '../lib/safe-action'
import { ObsidianClient } from '../client'
import { ActionResponse } from '../types/actions'

const initStructureSchema = z.object({
  vaultPath: z.string().default('Condominio')
})

export const initCondominioStructure = action(
  initStructureSchema,
  async ({ vaultPath }): Promise<ActionResponse> => {
    try {
      const client = new ObsidianClient()
      
      // Estructura base de directorios
      const structure = {
        'Vecinos/Registro de Vecinos.md': `---
tipo: registro
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
---
# Registro de Vecinos

## Casa 12
- Dirección: 0x09471f22B1033b8f9b1922Ee67313EFB7B5359E2
- Tokens: 1
- Estado: Activo
- Carpeta: [[Vecinos/Casa 12/Perfil]]
`,
        'Vecinos/Casa 12/Perfil.md': `---
tipo: perfil_vecino
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
casa: "12"
direccion: "0x09471f22B1033b8f9b1922Ee67313EFB7B5359E2"
tokens: 1
estado: "Activo"
---
# Perfil - Casa 12

## Información General
- Casa: 12
- Dirección: 0x09471f22B1033b8f9b1922Ee67313EFB7B5359E2
- Tokens de Votación: 1
- Estado: Activo

## Enlaces Relacionados
- [[../Historial de Pagos|Historial de Pagos]]
- [[../Documentos|Documentos]]
- [[../Propuestas|Propuestas Participadas]]
`,
        'Vecinos/Casa 12/Historial de Pagos.md': `---
tipo: historial_pagos_vecino
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
casa: "12"
---
# Historial de Pagos - Casa 12

## Marzo 2024
- Cuota Mensual: Pendiente
- Monto: $X
- Fecha Límite: DD/MM/YYYY

## Historial
| Fecha | Concepto | Monto | Estado |
|-------|----------|-------|---------|
| Mar 2024 | Cuota Mensual | $X | Pendiente |
`,
        'Vecinos/Casa 12/Documentos.md': `---
tipo: documentos_vecino
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
casa: "12"
---
# Documentos - Casa 12

## Documentos Importantes
- Contrato de Compra
- Reglamento Firmado
- Autorizaciones

## Notas
- Fecha de Ingreso: DD/MM/YYYY
- Observaciones: 
`,
        'Vecinos/Casa 12/Propuestas.md': `---
tipo: propuestas_vecino
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
casa: "12"
---
# Propuestas Participadas - Casa 12

## Propuestas Activas
- [[../../Asambleas/Propuestas Activas#propuesta-1|Propuesta 1]]

## Historial de Votaciones
| Fecha | Propuesta | Voto | Resultado |
|-------|-----------|------|-----------|
| Mar 2024 | Propuesta 1 | A Favor | En Proceso |
`,
        'Vecinos/Historial de Pagos.md': `---
tipo: historial_pagos
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
---
# Historial de Pagos General

## Marzo 2024
- [[Casa 12/Historial de Pagos|Casa 12]]: Pendiente

## Resumen por Mes
| Mes | Total Recaudado | Pendiente | % Pagado |
|-----|-----------------|-----------|-----------|
| Mar 2024 | $0 | $X | 0% |
`,
        'Asambleas/Acta Actual.md': `---
tipo: acta
fecha: ${new Date().toISOString().split('T')[0]}
estado: activa
---
# Acta de Asamblea

## Propuestas Activas
`,
        'Asambleas/Propuestas Activas.md': `---
tipo: propuestas
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
---
# Propuestas Activas

## En Votación
`,
        'Proveedores/Registro de Proveedores.md': `---
tipo: registro_proveedores
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
---
# Registro de Proveedores

## Proveedores Activos
`,
        'Proveedores/Historial de Pagos.md': `---
tipo: historial_pagos_proveedores
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
---
# Historial de Pagos a Proveedores

## Marzo 2024
`,
        'Finanzas/Estado de Cuenta.md': `---
tipo: estado_cuenta
fecha: ${new Date().toISOString().split('T')[0]}
---
# Estado de Cuenta

## Balance General
- Ingresos: $0
- Gastos: $0
- Balance: $0
`,
        'Finanzas/Presupuesto.md': `---
tipo: presupuesto
fecha_actualizacion: ${new Date().toISOString().split('T')[0]}
---
# Presupuesto Anual

## Ingresos Esperados
- Cuotas Mensuales: $0

## Gastos Planificados
- Mantenimiento: $0
- Servicios: $0
`
      }

      // Crear cada archivo
      for (const [path, content] of Object.entries(structure)) {
        const fullPath = `${vaultPath}/${path}`
        await client.saveFile({
          path: fullPath,
          content
        })
      }

      return {
        success: true,
        data: {
          message: 'Estructura del condominio creada exitosamente',
          paths: Object.keys(structure).map(path => `${vaultPath}/${path}`)
        }
      }
    } catch (error) {
      console.error('Error al crear estructura:', error)
      return {
        success: false,
        error: {
          message: 'Error al crear la estructura del condominio',
          details: error instanceof Error ? error.message : 'Error desconocido'
        }
      }
    }
  }
) 