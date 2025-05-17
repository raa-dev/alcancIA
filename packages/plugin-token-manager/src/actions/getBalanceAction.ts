import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger,
    generateObjectDeprecated,
    ModelClass,
    composeContext
} from "@elizaos/core"
import { initWalletProvider } from "../providers/wallet"
import type { SupportedChain } from "../types"

interface BalanceParams {
    chain?: SupportedChain
}

const getBalanceTemplate = `
You are an AI assistant that helps users check their wallet balance.
You MUST respond with a valid JSON object containing the following fields:
- chain: (optional) The blockchain network to check the balance on (e.g., "arbitrumSepolia", "base", "sepolia"). If not provided, will use the current chain.

Example response format:
{
    "chain": "arbitrumSepolia"
}

IMPORTANT: 
1. Your response MUST be a valid JSON object, nothing else.
2. Do not include any text before or after the JSON.
3. Use one of these supported chains: arbitrumSepolia, base, sepolia, or hardhat.
4. The chain field is optional - if not provided, will use the current chain.
`

export const getBalanceAction: Action = {
    name: "GET_WALLET_BALANCE",
    similes: ["BALANCE", "SALDO", "CHECK_BALANCE", "VER_SALDO"],
    description: "Obtiene el balance de la wallet del agente en la cadena especificada o en la cadena actual",
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY") as `0x${string}`
        if (!privateKey) {
            throw new Error("No hay una wallet configurada.")
        }
        return true
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: unknown,
        callback: HandlerCallback
    ) => {
        try {
            // Inicializar el wallet provider
            const walletProvider = await initWalletProvider(runtime)
            
            // Forzar el uso de Arbitrum Sepolia
            const chain = "arbitrumSepolia" as SupportedChain
            walletProvider.switchChain(chain)
            const balance = await walletProvider.getWalletBalanceForChain(chain)
            const address = walletProvider.getAddress()
            
            if (!balance) {
                throw new Error(`No se pudo obtener el balance en la cadena ${chain}`)
            }

            // Crear la respuesta
            const response = {
                text: `Balance de la wallet ${address} en ${chain}: ${balance} ETH`,
                action: "GET_WALLET_BALANCE",
                content: {
                    address,
                    balance,
                    chain,
                    formattedBalance: `${balance} ETH`
                }
            }

            // Registrar la acción
            runtime.databaseAdapter.log({
                body: { message, response },
                userId: message.userId,
                roomId: message.roomId,
                type: "get_wallet_balance"
            })

            // Ejecutar el callback con la respuesta
            await callback(response)
            return response

        } catch (error) {
            elizaLogger.error("Error al obtener el balance de la wallet:", error)
            
            // Mensaje de error más amigable y descriptivo
            let errorMessage = "Error al obtener el balance de la wallet"
            if (error.message.includes("EVM_PRIVATE_KEY is missing")) {
                errorMessage = "No hay una wallet configurada."
            } else if (error.message.includes("Invalid private key")) {
                errorMessage = "La clave privada configurada no es válida."
            }

            const errorResponse = {
                text: errorMessage,
                action: "GET_WALLET_BALANCE",
                content: {
                    error: errorMessage,
                    requiresSetup: error.message.includes("EVM_PRIVATE_KEY is missing")
                }
            }
            
            await callback(errorResponse)
            return errorResponse
        }
    },
    examples: [
        [
            {
                user: "assistant",
                content: {
                    text: "Voy a verificar el balance de tu wallet en Arbitrum Sepolia",
                    action: "GET_WALLET_BALANCE"
                }
            },
            {
                user: "user",
                content: {
                    text: "¿Cuál es mi balance en Arbitrum Sepolia?",
                    action: "GET_WALLET_BALANCE"
                }
            }
        ],
        [
            {
                user: "assistant",
                content: {
                    text: "Voy a verificar el balance de tu wallet en la cadena actual",
                    action: "GET_WALLET_BALANCE"
                }
            },
            {
                user: "user",
                content: {
                    text: "¿Cuál es mi balance?",
                    action: "GET_WALLET_BALANCE"
                }
            }
        ]
    ]
} 