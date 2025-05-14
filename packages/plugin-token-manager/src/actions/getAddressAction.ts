import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@elizaos/core"
import { initWalletProvider } from "../providers/wallet"

export const getAddressAction: Action = {
    name: "GET_WALLET_ADDRESS",
    similes: ["ADDRESS", "WALLET", "DIRECCION"],
    description: "Obtiene la dirección de la wallet del agente en la cadena actual",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validación simple: verificar que existe la clave privada
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY") as `0x${string}`
        if (!privateKey) {
            // Lanzamos un error descriptivo encaso de no tener una wallet configurada
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
            
            // Obtener la dirección y la cadena actual
            const address = walletProvider.getAddress()
            const chain = walletProvider.getCurrentChain()
            
            // Crear la respuesta
            const response = {
                text: `La dirección de mi wallet es: ${address}\nCadena: ${chain.name} (ID: ${chain.id})`,
                action: "GET_WALLET_ADDRESS",
                content: {
                    address,
                    chain: {
                        id: chain.id,
                        name: chain.name
                    }
                }
            }

            // Registrar la acción
            runtime.databaseAdapter.log({
                body: { message, response },
                userId: message.userId,
                roomId: message.roomId,
                type: "get_wallet_address"
            })

            // Ejecutar el callback con la respuesta
            await callback(response)
            return response

        } catch (error) {
            console.error("Error al obtener la dirección de la wallet:", error)
            
            // Mensaje de error más amigable y descriptivo
            let errorMessage = "Error al obtener la dirección de la wallet"
            if (error.message.includes("EVM_PRIVATE_KEY is missing")) {
                errorMessage = "No hay una wallet configurada."
            } else if (error.message.includes("Invalid private key")) {
                errorMessage = "La clave privada configurada no es válida."
            }

            const errorResponse = {
                text: errorMessage,
                action: "GET_WALLET_ADDRESS",
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
                user: "{{user1}}",
                content: {
                    text: "¿Cuál es tu dirección de wallet?",
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "La dirección de mi wallet es: 0x...",
                    action: "GET_WALLET_ADDRESS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Muéstrame tu wallet",
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "La dirección de mi wallet es: 0x...",
                    action: "GET_WALLET_ADDRESS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "¿Cuál es tu wallet?",
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "No hay una wallet configurada.",
                    action: "GET_WALLET_ADDRESS",
                    content: {
                        error: "No hay una wallet configurada",
                        requiresSetup: true
                    }
                }
            }
        ]
    ]
} 