import { ObsidianClient } from '../client'
import dotenv from 'dotenv'
import path from 'path'

// Cargar variables de entorno y mostrar la ruta
const envPath = path.resolve(process.cwd(), '.env')
console.log('📁 Buscando .env en:', envPath)
dotenv.config()

// Verificar variables
console.log('\n🔑 Variables de entorno:')
console.log('OBSIDIAN_API_TOKEN:', process.env.OBSIDIAN_API_TOKEN ? '✅ Presente' : '❌ Faltante')
console.log('OBSIDIAN_API_PORT:', process.env.OBSIDIAN_API_PORT ? '✅ Presente' : '❌ Faltante')
console.log('OBSIDIAN_API_URL:', process.env.OBSIDIAN_API_URL ? '✅ Presente' : '❌ Faltante')

async function checkVault() {
  console.log('\n🔍 Verificando conexión con Obsidian...')
  
  try {
    const client = new ObsidianClient()
    
    // Intentar listar archivos (esto fallará si el vault no está abierto)
    const files = await client.listFiles()
    
    console.log('✅ Conexión exitosa con Obsidian')
    console.log('📁 Vault abierto y accesible')
    console.log(`📊 Total de archivos en el vault: ${files.length}`)
    
    // Mostrar algunos archivos como ejemplo
    if (files.length > 0) {
      console.log('\n📄 Algunos archivos en el vault:')
      files.slice(0, 5).forEach(file => console.log(`- ${file}`))
    }
    
  } catch (error) {
    console.error('\n❌ Error al conectar con Obsidian:')
    if (error instanceof Error) {
      console.error(error.message)
      if (error.message.includes('Failed to fetch')) {
        console.log('\n💡 Sugerencias:')
        console.log('1. Asegúrate que Obsidian está abierto')
        console.log('2. Verifica que el plugin Local REST API está activo')
        console.log('3. Confirma que el puerto 27124 está disponible')
      }
    }
  }
}

checkVault() 