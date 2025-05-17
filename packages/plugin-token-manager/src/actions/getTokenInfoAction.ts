import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger,
} from "@elizaos/core"
import { VOTING_TOKEN_ABI, VOTING_TOKEN_CONTRACT_ADDRESS } from "../lib/VotingTokenABI"
import { createPublicClient, http } from "viem"
import { arbitrumSepolia } from "viem/chains"

export const getTokenInfoAction: Action = {
    name: "GET_TOKEN_INFO",
    similes: ["TOKEN_INFO", "INFO_TOKEN", "VER_TOKEN", "CONSULTAR_TOKEN"],
    description: "Obtiene la información básica del token de votación (nombre y símbolo)",
    validate: async (_runtime: IAgentRuntime) => {
        return true // No requiere validación especial
    },
    handler: async (
        _runtime: IAgentRuntime,
        message: Memory,
        _state: State,
        _options: unknown,
        callback: HandlerCallback
    ) => {
        try {
            const publicClient = createPublicClient({ 
                chain: arbitrumSepolia,
                transport: http()
            })

            // Obtener nombre y símbolo del token
            const [name, symbol, decimals] = await Promise.all([
                publicClient.readContract({
                    address: VOTING_TOKEN_CONTRACT_ADDRESS,
                    abi: VOTING_TOKEN_ABI,
                    functionName: "name"
                }),
                publicClient.readContract({
                    address: VOTING_TOKEN_CONTRACT_ADDRESS,
                    abi: VOTING_TOKEN_ABI,
                    functionName: "symbol"
                }),
                publicClient.readContract({
                    address: VOTING_TOKEN_CONTRACT_ADDRESS,
                    abi: VOTING_TOKEN_ABI,
                    functionName: "decimals"
                })
            ])

            const response = {
                text: `Información del token:\nNombre: ${name}\nSímbolo: ${symbol}\nDecimales: ${decimals}`,
                action: "GET_TOKEN_INFO",
                content: {
                    name,
                    symbol,
                    decimals,
                    address: VOTING_TOKEN_CONTRACT_ADDRESS
                }
            }

            await callback(response)
            return response

        } catch (error) {
            elizaLogger.error("Error al obtener información del token:", error)
            
            const errorResponse = {
                text: "Error al obtener la información del token",
                action: "GET_TOKEN_INFO",
                content: {
                    error: "Error al obtener la información del token"
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
                    text: "Voy a consultar la información del token de votación",
                    action: "GET_TOKEN_INFO"
                }
            },
            {
                user: "user",
                content: {
                    text: "¿Qué token se usa para votar?",
                    action: "GET_TOKEN_INFO"
                }
            }
        ]
    ]
} 