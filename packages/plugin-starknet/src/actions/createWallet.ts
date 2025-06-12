import {
  type Action,
  type IAgentRuntime,
  type Memory,
  type State,
  type HandlerCallback,
  type Content,
  elizaLogger
} from "@elizaos/core"
import { ChipiWalletProvider } from "../providers/chipiWalletProvider"

export interface CreateWalletContent extends Content {
  pin?: string
  email?: string
}

// Función auxiliar para extraer el correo del texto
function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const match = text.match(emailRegex)
  return match ? match[0] : null
}

const createWalletAction: Action = {
  name: "CREATE_CHIPI_WALLET",
  similes: [
    "CREATE_INVISIBLE_WALLET",
    "CREATE_SOCIAL_WALLET",
    "CREATE_STARKNET_WALLET"
  ],
  description: "Crea una wallet invisible en Starknet usando ChipiPay.",
  validate: async (_runtime, _message) => true,
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: { [key: string]: unknown },
    callback?: HandlerCallback
  ) => {
    try {
      // Configuración del provider
      const provider = new ChipiWalletProvider({
        apiPublicKey: process.env.CHIPI_API_PUBLIC_KEY!
      })

      // Extraer el pin y el correo electrónico
      const pin = typeof message.content?.pin === 'string' ? message.content.pin : "01234"
      const emailFromContent = typeof message.content?.email === 'string' ? message.content.email : null
      const emailFromText = message.content?.text ? extractEmail(message.content.text) : null
      const email = emailFromContent || emailFromText || ""

      // Validar que el correo esté presente y tenga formato válido
      if (!email || !email.includes("@")) {
        callback?.({
          text: "Por favor proporciona un correo electrónico válido para asociar tu wallet.",
          content: { error: "Missing or invalid email" }
        })
        return false
      }

      elizaLogger.log("Creando wallet con email:", email)

      // Usar el correo como bearerToken
      const wallet = await provider.createWallet({ 
        encryptKey: pin,
        bearerToken: email,
        apiPublicKey: process.env.CHIPI_API_PUBLIC_KEY!,
        nodeUrl: process.env.STARKNET_RPC_URL || 'https://starknet-mainnet.infura.io/v3/'
      })

      elizaLogger.log("Wallet creada:", wallet)

      callback?.({
        text: `¡Wallet creada exitosamente! ${JSON.stringify(wallet)}`,
        content: { wallet }
      })
      return true
    } catch (error: any) {
      elizaLogger.error("Error al crear wallet:", error)
      callback?.({
        text: `Error al crear la wallet: ${error.message}`,
        content: { error: error.message }
      })
      return false
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Crea mi wallet invisible en Starknet con el correo usuario@email.com" }
      },
      {
        user: "{{agent}}",
        content: { text: "¡Wallet creada exitosamente! Dirección: 0x..." }
      }
    ]
  ]
}

export default createWalletAction 