import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger,
    composeContext,
    generateObjectDeprecated,
    ModelClass
} from "@elizaos/core"
import { initWalletProvider } from "../providers/wallet"
import { VOTING_TOKEN_ABI, VOTING_TOKEN_CONTRACT_ADDRESS } from "../lib/VotingTokenABI"
import { type SupportedChain } from "../types"
import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { arbitrumSepolia } from "viem/chains"

interface DistributeTokensParams {
    neighbors: `0x${string}`[]
    chain?: SupportedChain
}

const distributeTokensTemplate = `
You are an AI assistant that helps users distribute voting tokens to neighbors.
You MUST respond with a valid JSON object containing the following fields:
- neighbors: Array of neighbor addresses to distribute tokens to (must be valid Ethereum addresses)

Example response format:
{
    "neighbors": ["0x09471f22B1033b8f9b1922Ee67313EFB7B5359E2"]
}

IMPORTANT: 
1. Your response MUST be a valid JSON object, nothing else.
2. Do not include any text before or after the JSON.
3. Each address must be a valid Ethereum address starting with 0x.
4. Extract ONLY the addresses provided in the user's message.
5. DO NOT add any example addresses or additional addresses.
6. If the user provides one address, return an array with only that address.
7. DO NOT use the example address in your response, use the actual address from the user's message.
`

const buildDistributeTokensParams = async (
    state: State,
    runtime: IAgentRuntime,
    message: Memory
): Promise<DistributeTokensParams> => {
    // Agregar el mensaje al estado para que el template pueda acceder a él
    state.lastMessage = message

    // Extraer la dirección directamente del mensaje
    const addressMatch = message.content.text.match(/0x[a-fA-F0-9]{40}/)
    if (!addressMatch) {
        throw new Error("No se encontró una dirección válida en el mensaje")
    }

    const params: DistributeTokensParams = {
        neighbors: [addressMatch[0] as `0x${string}`]
    }

    return params
}

export const distributeTokensAction: Action = {
    name: "DISTRIBUTE_TOKENS",
    similes: ["DISTRIBUIR_TOKENS", "DISTRIBUIR_VOTOS", "ASIGNAR_TOKENS", "ASIGNAR_VOTOS"],
    description: "Distribuye 1 token de votación a cada vecino especificado",
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY") as `0x${string}`
        if (!privateKey) throw new Error("No hay una wallet configurada.")
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
            // Usar el template para extraer las direcciones
            const options = await buildDistributeTokensParams(state, runtime, message)

            // Obtener la clave privada y crear la cuenta
            const privateKey = runtime.getSetting("EVM_PRIVATE_KEY") as `0x${string}`
            if (!privateKey) throw new Error("No hay una wallet configurada.")

            const account = {
                ...privateKeyToAccount(privateKey),
                type: "local" as const
            }

            // Configurar los clients con el RPC de las configuraciones
            const rpcUrl = runtime.getSetting("ETHEREUM_PROVIDER_ARBITRUMSEPOLIA") as string
            if (!rpcUrl) throw new Error("No hay un RPC URL configurado para Arbitrum Sepolia. Por favor, configura ETHEREUM_PROVIDER_ARBITRUMSEPOLIA en el archivo .env con un RPC de Alchemy o Infura")

            // Verificar que el RPC URL es válido
            if (rpcUrl.includes("sepolia-rollup.arbitrum.io")) {
                throw new Error("El RPC URL no puede ser el público de Arbitrum Sepolia. Por favor, usa un RPC de Alchemy o Infura")
            }

            const publicClient = createPublicClient({ 
                chain: arbitrumSepolia,
                transport: http(rpcUrl)
            })

            const walletClient = createWalletClient({
                chain: arbitrumSepolia,
                transport: http(rpcUrl),
                account
            })

            if (!walletClient) throw new Error("No se pudo inicializar el wallet client")

            // Preparar la transacción
            const neighborAddress = options.neighbors[0]

            // Verificar si el vecino ya tiene tokens
            const balance = await publicClient.readContract({
                address: VOTING_TOKEN_CONTRACT_ADDRESS,
                abi: VOTING_TOKEN_ABI,
                functionName: "balanceOf",
                args: [neighborAddress]
            })

            if (balance > 0n) {
                throw new Error(`El vecino ${neighborAddress} ya tiene tokens asignados`)
            }

            // Preparar la transacción
            const { request } = await publicClient.simulateContract({
                address: VOTING_TOKEN_CONTRACT_ADDRESS,
                abi: VOTING_TOKEN_ABI,
                functionName: "distributeTokens",
                args: [[neighborAddress]],
                account: account.address
            })

            // Firmar y enviar la transacción
            const hash = await walletClient.writeContract({
                ...request,
                chain: arbitrumSepolia,
                account
            })
            
            // Esperar la confirmación
            const receipt = await publicClient.waitForTransactionReceipt({ hash })

            if (receipt.status !== "success") {
                throw new Error("La transacción falló")
            }

            // Crear la respuesta
            const response = {
                text: `Tokens distribuidos exitosamente a ${options.neighbors.length} vecinos. Hash: ${hash}`,
                action: "DISTRIBUTE_TOKENS",
                content: {
                    hash,
                    neighbors: options.neighbors,
                    chain: "arbitrumSepolia",
                    status: "success"
                }
            }

            // Registrar la acción
            runtime.databaseAdapter.log({
                body: { message, response },
                userId: message.userId,
                roomId: message.roomId,
                type: "distribute_tokens"
            })

            await callback(response)
            return response

        } catch (error) {
            elizaLogger.error("Error al distribuir tokens:", {
                error,
                message: error.message,
                cause: error.cause,
                details: error.details,
                stack: error.stack
            })
            
            let errorMessage = "Error al distribuir tokens"
            if (error.message.includes("No hay una wallet configurada")) {
                errorMessage = "No hay una wallet configurada."
            } else if (error.message.includes("No hay un RPC URL configurado")) {
                errorMessage = "No hay un RPC URL configurado para Arbitrum Sepolia."
            } else if (error.cause?.details) {
                errorMessage = `Error en la transacción: ${error.cause.details}`
            } else if (error.details) {
                errorMessage = `Error en la transacción: ${error.details}`
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`
            }

            const errorResponse = {
                text: errorMessage,
                action: "DISTRIBUTE_TOKENS",
                content: {
                    error: errorMessage,
                    requiresSetup: error.message.includes("No hay una wallet configurada") || 
                                  error.message.includes("No hay un RPC URL configurado"),
                    details: error.cause?.details || error.details || error.message
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
                    text: "Voy a distribuir tokens de votación a los vecinos",
                    action: "DISTRIBUTE_TOKENS"
                }
            },
            {
                user: "user",
                content: {
                    text: "Distribuye tokens a estos vecinos:\nCasa 12: 0x123...",
                    action: "DISTRIBUTE_TOKENS"
                }
            }
        ]
    ]
} 